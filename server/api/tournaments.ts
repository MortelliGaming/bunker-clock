// netlify/functions/tournaments.js

const { promises: fs } = require('fs');
const path = require('path');

const dirPath = path.resolve('./'); // Absolute path to the data folder
const filePath = path.resolve('./tournaments.json'); // Path to the JSON file

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

      // Save tournaments to JSON file
      await fs.writeFile(filePath, JSON.stringify(body.data, null, 2));

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
      const data = await fs.readFile(filePath, 'utf-8'); // Read the JSON file
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, data: JSON.parse(data) }),
      };
    } catch (error) {
      console.error('Error loading tournaments:', error);
      return { statusCode: 200, body: JSON.stringify([]) };
    }
  }

  // Fallback for unsupported methods
  return {
    statusCode: 405,
    body: JSON.stringify({ success: false, message: 'Method Not Allowed' }),
  };
};
