import { Client, fql, FaunaError, QuerySuccess } from 'fauna';
import { Tournament } from '~/stores/tournaments';

const client = new Client({
  secret: 'fnAFxqTjO-AA0Nl9jIeNPo_UAm5kjpxn6gifrlbq', // Fetch your FaunaDB secret from environment variables
});

// Function to save tournaments to FaunaDB
async function saveTournamentsToFauna(tournaments: any) {
  try {
    // Iterate through the tournaments and save each one
    for (const tournament of tournaments) {
      const tournamentName = tournament.name;

      // Check if tournament exists
      const tournamentExistsQuery = fql`Tournament.byName(${tournamentName}) != null`;
      const tournamentExists = await client.query(tournamentExistsQuery);

      if (tournamentExists) {
        // Update existing tournament
        const updateTournamentQuery = fql`Tournament.update(${tournamentName}, ${tournament})`;
        await client.query(updateTournamentQuery);
        console.log(`Tournament "${tournamentName}" updated successfully.`);
      } else {
        // Insert new tournament
        const insertTournamentQuery = fql`Tournament.create({ name: ${tournamentName}, ...${tournament} })`;
        await client.query(insertTournamentQuery);
        console.log(`Tournament "${tournamentName}" created successfully.`);
      }
    }
  } catch (error: any) {
    throw new Error('Error saving tournaments to FaunaDB: ' + error.message);
  }
}

// Function to get all tournaments from FaunaDB
async function getTournamentsFromFauna() {
  try {
    const result = await client.query(
      fql`
        Tournament.all()
      `
    );
    return result.data;
  } catch (error: any) {
    throw new Error('Error retrieving tournaments from FaunaDB: ' + error.message);
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
