'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');
const tokenRoutes = require('./routes/token');
const agentRoutes = require('./routes/agent');
const mcpRouter = require('./mcp/index');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'intentio-backend', timestamp: new Date().toISOString() });
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/token', tokenRoutes);
app.use('/api/agent', agentRoutes);
app.use('/mcp', mcpRouter);  // MCP server endpoint for Agora tool calling

// ─── Error Handler (must be last) ────────────────────────────────────────────
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Intentio backend running on http://localhost:${PORT}`);
  console.log(`🔧 MCP server available at http://localhost:${PORT}/mcp`);
  console.log(`❤️  Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
