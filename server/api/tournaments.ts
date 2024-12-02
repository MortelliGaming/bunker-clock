import { promises as fs } from 'fs';
import path from 'path';
import { H3Event } from 'h3';
import { Tournament } from '~/stores/tournaments';

const dirPath = path.dirname('./data'); // Extract the directory path
const filePath = path.resolve('./data/tournaments.json'); // Path to the JSON file

// Middleware to validate the origin
function validateOrigin(event: H3Event): void {
    const allowedOrigins = ['https://bunkerclock.mortelligaming.org/', 'http://localhost:5173/'];
    const origin = event.headers.get('referer') || event.headers.get('host') || '';
    if (!allowedOrigins.includes(origin)) {
        throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden: Invalid Origin',
        });
    }
}

// Function to validate tournament data
function validateTournaments(data: unknown): asserts data is Tournament[] {
  if (!Array.isArray(data)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid data: Expected an array of tournaments',
    });
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
      throw createError({
        statusCode: 400,
        statusMessage: `Invalid tournament structure: ${JSON.stringify(tournament)}`,
      });
    }
  }
}

export default defineEventHandler(async (event) => {
  validateOrigin(event); // Ensure requests come from the allowed origin

  if (event.req.method === 'POST') {
    try {
      const body = await readBody(event); // Read the incoming JSON
      if (!body || !Array.isArray(body.data)) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Invalid request body: Expected { data: Tournament[] }',
        });
      }

      validateTournaments(body.data); // Validate the structure of Tournament[]

      // Ensure the directory exists
      await fs.mkdir(dirPath, { recursive: true });

      // Save tournaments to JSON file
      await fs.writeFile(filePath, JSON.stringify(body.data, null, 2));
      return { success: true, message: 'Tournaments saved successfully!' };
    } catch (error) {
      console.error('Error saving tournaments:', error);
      return { success: false, message: 'Error saving tournaments.', error };
    }
  }

  if (event.req.method === 'GET') {
    try {
      const data = await fs.readFile(filePath, 'utf-8'); // Read the JSON file
      return { success: true, message: JSON.parse(data) };
    } catch (error) {
      console.error('Error loading tournaments:', error);
      return { success: false, message: 'Error loading tournaments.', error };
    }
  }

  // Fallback for unsupported methods
  return { success: false, message: 'Unsupported HTTP method.' };
});
