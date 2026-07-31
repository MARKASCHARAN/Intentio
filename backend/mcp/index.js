'use strict';

const express = require('express');
const flightBooking = require('./tools/flightBooking');
const calendar = require('./tools/calendar');
const weather = require('./tools/weather');

const router = express.Router();

/**
 * MCP Server — Model Context Protocol tool server for Intentio.
 *
 * This Express sub-router exposes tools that the Agora LLM agent can call
 * when it needs to perform external API actions (flights, calendar, weather).
 *
 * The agent's MCP config points to: http://<server>/mcp
 *
 * Tool registration follows the MCP spec:
 * POST /mcp/tools/call  → calls a named tool with arguments
 * GET  /mcp/tools/list  → returns available tool schemas
 */

const TOOLS = [
  flightBooking.schema,
  calendar.addEventSchema,
  calendar.checkAvailabilitySchema,
  weather.schema,
];

/**
 * GET /mcp/tools/list
 * Returns the list of available tools with their JSON schemas.
 * The Agora AI Engine uses this to know what tools are available.
 */
router.get('/tools/list', (_req, res) => {
  res.json({tools: TOOLS});
});

/**
 * POST /mcp/tools/call
 * Executes a named tool with the provided arguments.
 *
 * Request body:
 * {
 *   name: "searchFlights" | "bookFlight" | "addCalendarEvent" | "checkAvailability" | "getWeather",
 *   arguments: { ... }
 * }
 */
router.post('/tools/call', async (req, res, next) => {
  const {name, arguments: args = {}} = req.body;

  console.log(`[MCP] Tool call: ${name}`, args);

  try {
    let result;

    switch (name) {
      case 'searchFlights':
        result = await flightBooking.searchFlights(args);
        break;
      case 'bookFlight':
        result = await flightBooking.bookFlight(args);
        break;
      case 'addCalendarEvent':
        result = await calendar.addEvent(args);
        break;
      case 'checkAvailability':
        result = await calendar.checkAvailability(args);
        break;
      case 'getWeather':
        result = await weather.getWeather(args);
        break;
      default:
        return res.status(404).json({
          success: false,
          error: {message: `Unknown tool: ${name}`},
        });
    }

    console.log(`[MCP] Tool result for ${name}:`, result);
    return res.json({success: true, result});
  } catch (err) {
    next(err);
  }
});

module.exports = router;
