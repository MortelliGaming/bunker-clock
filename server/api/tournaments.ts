import { Client, fql, DocumentReference, QuerySuccess, } from 'fauna';
import { Tournament } from '~/stores/tournaments';

const client = new Client({
  secret: 'fnAFxqTjO-AA0Nl9jIeNPo_UAm5kjpxn6gifrlbq', // Fetch your FaunaDB secret from environment variables
});
async function saveTournamentsToFauna(tournaments: Tournament[]) {
  try {
    for (const tournament of tournaments) {
      const tournamentId =  new DocumentReference({
        id: tournament.id,
        coll: 'tournaments',
      }); // Assuming 'id' is the unique key for each tournament

      // Check if tournament exists by its 'id' (using fql)
      const tournamentExistsQuery = fql`exists(tournaments.byId(${tournamentId}))`;
      const tournamentExists = await client.query(tournamentExistsQuery);

      if (tournamentExists) {
        // Update existing tournament by its 'id'
        const updateTournamentQuery = fql`update(tournaments.byId(${tournamentId}), { data: ${JSON.stringify(tournament)} })`;
        await client.query(updateTournamentQuery);
        console.log(`Tournament with id "${tournamentId}" updated successfully.`);
      } else {
        // Insert new tournament
        const insertTournamentQuery = fql`create(tournaments, { id: ${tournamentId}, ...${JSON.stringify(tournament)} })`;
        await client.query(insertTournamentQuery);
        console.log(`Tournament with id "${tournamentId}" created successfully.`);
      }
    }
  } catch (error: any) {
    throw new Error('Error saving tournaments to FaunaDB: ' + error.message);
  }
}

// Function to get all tournaments from FaunaDB by ID

async function getTournamentsFromFauna() {
  try {
    // FQL-Abfrage, um alle Dokumente aus der 'tournaments' Collection zu erhalten
    const result = await client.query(fql`
      tournaments.all()
    `);
    console.log(result)
    // Extrahiert und gibt nur die Daten der Turniere zurück
    return result.data.data.map((item: any) => item.data) ?? []; // Nur die Daten extrahieren
  } catch (error: any) {
    console.error('Fehler beim Abrufen der Turniere aus FaunaDB:', error);
    throw new Error('Fehler beim Abrufen der Turniere aus FaunaDB: ' + error.message);
  }
}

// Middleware to validate the origin
function validateOrigin(headers: any) {
  const allowedOrigins = ['https://bunkerclock.mortelligaming.org/', 'http://localhost:5173/'];
  const origin = headers['referer'] || headers['host'] || '';
  if (!allowedOrigins.includes(origin)) {
    return { statusCode: 403, body: JSON.stringify({ error: 'Forbidden: Invalid Origin' }) };
  }
  return null;
}

// Function to validate tournament data
function validateTournaments(data: any) {
  if (!Array.isArray(data)) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid data: Expected an array of tournaments' }) };
  }

  for (const tournament of data) {
    if (
      typeof tournament.id !== 'string' ||
      typeof tournament.name !== 'string' ||
      typeof tournament.date !== 'string' ||
      typeof tournament.startTime !== 'string' ||
      typeof tournament.template !== 'string' ||
      !Array.isArray(tournament.chipset) ||
      !Array.isArray(tournament.players) ||
      typeof tournament.settings !== 'object'
    ) {
      return { statusCode: 400, body: JSON.stringify({ error: `Invalid tournament structure: ${JSON.stringify(tournament)}` }) };
    }
  }
  return null; // If validation passes
}

// Lambda handler function
exports.handler = async (event: any) => {
  const originError = validateOrigin(event.headers); // Ensure requests come from the allowed origin
  if (originError) return originError;

  if (event.httpMethod === 'POST') {
    try {
      const body = JSON.parse(event.body); // Read the incoming JSON
      if (!body || !Array.isArray(body.data)) {
        return { statusCode: 400, body: JSON.stringify({ error: 'Invalid request body: Expected { data: Tournament[] }' }) };
      }

      const validationError = validateTournaments(body.data); // Validate the structure of Tournament[]
      if (validationError) return validationError;

      // Save tournaments to FaunaDB
      await saveTournamentsToFauna(body.data);

      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, message: 'Tournaments saved successfully!' }),
      };
    } catch (error) {
      console.error('Error saving tournaments:', error);
      return { statusCode: 500, body: JSON.stringify({ success: false, message: 'Error saving tournaments.' }) };
    }
  }

  if (event.httpMethod === 'GET') {
    try {
      const tournaments = await getTournamentsFromFauna();

      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, data: tournaments }),
      };
    } catch (error) {
      console.error('Error loading tournaments:', error);
      return { statusCode: 500, body: JSON.stringify({ success: false, message: 'Error retrieving tournaments.' }) };
    }
  }

  // Fallback for unsupported methods
  return {
    statusCode: 405,
    body: JSON.stringify({ success: false, message: 'Method Not Allowed' }),
  };
};
