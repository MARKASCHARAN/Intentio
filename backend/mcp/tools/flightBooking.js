'use strict';

/**
 * Flight Booking Tool — MCP tool for searching and booking flights.
 *
 * Currently returns mock data. Replace with a real flight API
 * (e.g., Amadeus, Skyscanner, Duffel) for production.
 */

const schema = {
  name: 'searchFlights',
  description:
    'Search for available flights between two cities on a given date. Returns a list of flight options with prices and times.',
  inputSchema: {
    type: 'object',
    properties: {
      origin: {
        type: 'string',
        description: 'Departure airport IATA code (e.g., BOM for Mumbai, LHR for London)',
      },
      destination: {
        type: 'string',
        description: 'Arrival airport IATA code',
      },
      date: {
        type: 'string',
        description: 'Travel date in ISO 8601 format (YYYY-MM-DD)',
      },
      passengers: {
        type: 'number',
        description: 'Number of passengers (default: 1)',
        default: 1,
      },
    },
    required: ['origin', 'destination', 'date'],
  },
};

const bookFlightSchema = {
  name: 'bookFlight',
  description: 'Book a specific flight using a flight ID from searchFlights results.',
  inputSchema: {
    type: 'object',
    properties: {
      flightId: {
        type: 'string',
        description: 'The flight ID from search results',
      },
      passengerName: {
        type: 'string',
        description: 'Full name of the passenger',
      },
      email: {
        type: 'string',
        description: 'Contact email address',
      },
    },
    required: ['flightId', 'passengerName', 'email'],
  },
};

/**
 * Search for available flights (mock implementation).
 *
 * @param {object} args
 * @param {string} args.origin
 * @param {string} args.destination
 * @param {string} args.date
 * @param {number} [args.passengers=1]
 */
async function searchFlights({origin, destination, date, passengers = 1}) {
  // TODO: Replace with real flight API call
  console.log(`[FlightTool] Searching ${origin} → ${destination} on ${date} for ${passengers} pax`);

  // Mock flight data
  const mockFlights = [
    {
      flightId: `FL-${Date.now()}-001`,
      airline: 'SkyWing Airlines',
      flightNumber: 'SW 142',
      origin,
      destination,
      date,
      departure: '08:30',
      arrival: '14:45',
      duration: '6h 15m',
      price: `$${(299 + passengers * 100).toFixed(2)}`,
      class: 'Economy',
      seatsLeft: 12,
    },
    {
      flightId: `FL-${Date.now()}-002`,
      airline: 'CloudJet',
      flightNumber: 'CJ 887',
      origin,
      destination,
      date,
      departure: '13:00',
      arrival: '19:30',
      duration: '6h 30m',
      price: `$${(249 + passengers * 100).toFixed(2)}`,
      class: 'Economy',
      seatsLeft: 3,
    },
    {
      flightId: `FL-${Date.now()}-003`,
      airline: 'SkyWing Airlines',
      flightNumber: 'SW 210',
      origin,
      destination,
      date,
      departure: '21:00',
      arrival: '03:45+1',
      duration: '6h 45m',
      price: `$${(399 + passengers * 100).toFixed(2)}`,
      class: 'Business',
      seatsLeft: 8,
    },
  ];

  return {
    searchId: `SEARCH-${Date.now()}`,
    origin,
    destination,
    date,
    passengers,
    totalResults: mockFlights.length,
    flights: mockFlights,
  };
}

/**
 * Book a flight (mock implementation).
 *
 * @param {object} args
 * @param {string} args.flightId
 * @param {string} args.passengerName
 * @param {string} args.email
 */
async function bookFlight({flightId, passengerName, email}) {
  // TODO: Replace with real booking API call
  console.log(`[FlightTool] Booking flight=${flightId} for ${passengerName}`);

  const bookingRef = `BOOK-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  return {
    success: true,
    bookingReference: bookingRef,
    flightId,
    passengerName,
    email,
    status: 'CONFIRMED',
    message: `Flight booked successfully! Your booking reference is ${bookingRef}. A confirmation has been sent to ${email}.`,
  };
}

module.exports = {schema, bookFlightSchema, searchFlights, bookFlight};
