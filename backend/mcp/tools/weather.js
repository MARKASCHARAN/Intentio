'use strict';

/**
 * Weather Tool — MCP tool for getting current weather and forecasts.
 * Mock implementation — connect to OpenWeatherMap or similar for production.
 */

const schema = {
  name: 'getWeather',
  description:
    'Get current weather conditions and forecast for a city. Returns temperature, conditions, and a brief summary.',
  inputSchema: {
    type: 'object',
    properties: {
      city: {
        type: 'string',
        description: 'City name (e.g., London, Mumbai, New York)',
      },
      days: {
        type: 'number',
        description: 'Number of forecast days (1-7, default: 1)',
        default: 1,
      },
    },
    required: ['city'],
  },
};

const MOCK_WEATHER = {
  London: {
    current: '18°C, Partly Cloudy',
    humidity: '72%',
    wind: '15 km/h NW',
    forecast: ['19°C Cloudy', '16°C Rainy', '21°C Sunny'],
  },
  Mumbai: {
    current: '31°C, Humid',
    humidity: '85%',
    wind: '20 km/h SW',
    forecast: ['32°C Partly Cloudy', '30°C Thunderstorms', '29°C Overcast'],
  },
  'New York': {
    current: '24°C, Sunny',
    humidity: '55%',
    wind: '10 km/h E',
    forecast: ['26°C Clear', '23°C Partly Cloudy', '20°C Windy'],
  },
};

/**
 * Get weather for a city.
 *
 * @param {object} args
 * @param {string} args.city
 * @param {number} [args.days=1]
 */
async function getWeather({city, days = 1}) {
  // TODO: Replace with real weather API call (e.g., OpenWeatherMap)
  console.log(`[WeatherTool] Getting weather for ${city} (${days} day${days > 1 ? 's' : ''})`);

  // Look up mock data or generate plausible random data
  const weatherData = MOCK_WEATHER[city] || {
    current: `${20 + Math.floor(Math.random() * 15)}°C, ${['Sunny', 'Cloudy', 'Partly Cloudy', 'Windy'][Math.floor(Math.random() * 4)]}`,
    humidity: `${50 + Math.floor(Math.random() * 40)}%`,
    wind: `${5 + Math.floor(Math.random() * 25)} km/h`,
    forecast: Array.from({length: 7}, (_, i) => `${18 + Math.floor(Math.random() * 12)}°C ${['Sunny', 'Cloudy', 'Rainy'][Math.floor(Math.random() * 3)]}`),
  };

  const forecastDays = weatherData.forecast.slice(0, Math.min(days, 7));

  const message =
    days === 1
      ? `Right now in ${city}: ${weatherData.current}. Humidity: ${weatherData.humidity}, Wind: ${weatherData.wind}.`
      : `In ${city}: Currently ${weatherData.current}. ${days}-day forecast: ${forecastDays.join(', ')}.`;

  return {
    city,
    current: weatherData.current,
    humidity: weatherData.humidity,
    wind: weatherData.wind,
    forecast: forecastDays,
    message,
  };
}

module.exports = {schema, getWeather};
