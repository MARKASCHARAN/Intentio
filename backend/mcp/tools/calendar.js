'use strict';

/**
 * Calendar Tool — MCP tool for managing calendar events.
 * Mock implementation — connect to Google Calendar API or similar for production.
 */

const addEventSchema = {
  name: 'addCalendarEvent',
  description: 'Add an event to the user\'s calendar.',
  inputSchema: {
    type: 'object',
    properties: {
      title: {type: 'string', description: 'Event title'},
      date: {type: 'string', description: 'Date in YYYY-MM-DD format'},
      time: {type: 'string', description: 'Time in HH:MM format (24h)'},
      duration: {type: 'number', description: 'Duration in minutes (default: 60)', default: 60},
      description: {type: 'string', description: 'Optional event description'},
    },
    required: ['title', 'date', 'time'],
  },
};

const checkAvailabilitySchema = {
  name: 'checkAvailability',
  description: 'Check if the user is available at a specific date and time.',
  inputSchema: {
    type: 'object',
    properties: {
      date: {type: 'string', description: 'Date in YYYY-MM-DD format'},
      time: {type: 'string', description: 'Time in HH:MM format (24h)'},
      duration: {type: 'number', description: 'Duration in minutes', default: 60},
    },
    required: ['date', 'time'],
  },
};

/** In-memory calendar store (replace with real API) */
const calendarStore = [];

/**
 * Add an event to the calendar.
 */
async function addEvent({title, date, time, duration = 60, description = ''}) {
  console.log(`[CalendarTool] Adding event: "${title}" on ${date} at ${time}`);

  const eventId = `EVT-${Date.now()}`;
  const event = {id: eventId, title, date, time, duration, description};
  calendarStore.push(event);

  return {
    success: true,
    eventId,
    message: `"${title}" has been added to your calendar for ${date} at ${time} (${duration} minutes).`,
    event,
  };
}

/**
 * Check if the user is available at a specific time.
 */
async function checkAvailability({date, time, duration = 60}) {
  console.log(`[CalendarTool] Checking availability: ${date} at ${time}`);

  const conflict = calendarStore.find(e => e.date === date && e.time === time);

  if (conflict) {
    return {
      available: false,
      message: `You have "${conflict.title}" at ${time} on ${date}. Would you like to choose a different time?`,
      conflictingEvent: conflict,
    };
  }

  return {
    available: true,
    message: `You're free at ${time} on ${date}! Shall I book it?`,
  };
}

module.exports = {addEventSchema, checkAvailabilitySchema, addEvent, checkAvailability};
