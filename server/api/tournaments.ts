import { Client, query as q } from 'faunadb';

const client = new Client({
  secret: 'fnAFxqRl9BAAy0_-6SqtKfUv_jD1c6c9wg96et5f', // Fetch your FaunaDB secret from environment variables
});

async function saveTournamentsToFauna(tournaments: any) {
  try {
    // Assuming `tournaments` is an array of tournament objects
    const result = await client.query(
      q.Create(q.Collection('tournaments'), {
        data: { tournaments: tournaments },
      })
    );
    return result;
  } catch (error: any) {
    throw new Error('Error saving tournaments to FaunaDB: ' + error.message);
  }
}

async function getTournamentsFromFauna() {
  try {
    const result = await client.query(
      q.Map(
        q.Paginate(q.Documents(q.Collection('tournaments'))),
        q.Lambda('X', q.Get(q.Var('X')))
      )
    ) as any;
    return result.data.map((item: any) => item.data.tournaments); // Return the tournaments array
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
      const saveResult = await saveTournamentsToFauna(body.data);

      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, message: 'Tournaments saved successfully!', result: saveResult }),
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