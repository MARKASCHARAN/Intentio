'use strict';

const express = require('express');
const axios = require('axios');
const router = express.Router();

/**
 * In-memory session store.
 */
const activeSessions = new Map();

/** Build the Agora Conversational AI Engine v2.9 base URL */
const getAgoraApiBase = () => {
  const appId = process.env.AGORA_APP_ID;
  return `https://api.agora.io/api/conversational-ai-agent/v2/projects/${appId}`;
};

/** Agora REST API auth headers */
const getAuthHeaders = () => {
  const key = process.env.AGORA_API_KEY;
  const secret = process.env.AGORA_API_SECRET;
  const credentials = Buffer.from(`${key}:${secret}`).toString('base64');
  return { Authorization: `Basic ${credentials}` };
};

/**
 * Intentio system prompt — defines the agent's personality.
 */
const INTENTIO_SYSTEM_PROMPT = `You are Intentio, an autonomous voice-first mobile agent that replaces app-based navigation with conversational intent understanding.

**Greeting Instruction:**
- When the session connects or user joins, greet them warmly in voice: "Hello! I'm Intentio—your autonomous mobile agent. Just tell me what you need, and I'll handle the rest."

**Your Role & Personality:**
- You understand user intent (booking tickets, flights, calendar events, weather, daily tasks) and respond in natural, friendly voice output.
- Always provide immediate, helpful voice responses fulfilling their intent.
- For requests like booking tickets or scheduling flights, confirm the booking in natural conversational voice (e.g., "I'd be glad to help you book a ticket to London for tomorrow night! I am checking flight options and reserving your seat now.").
- Keep all responses concise, conversational, and polished for voice playback. Never output raw code or JSON formatting.`;

const GREETING_TEXT = "Hello! I'm Intentio—your autonomous mobile agent. Just tell me what you need, and I'll handle the rest.";

/**
 * POST /api/agent/start
 *
 * Starts the Intentio AI agent in the specified Agora channel.
 * Uses Agora v2.9 Conversational AI Engine:
 * - ASR: Agora ASR (en-US)
 * - LLM: OpenAI GPT-4o
 * - TTS: OpenAI TTS (nova)
 * - RTM enabled (for state notifications + transcripts)
 */
router.post('/start', async (req, res, next) => {
  try {
    const { channelName, userUid, token } = req.body;

    if (!channelName || !userUid || !token) {
      return res.status(400).json({
        success: false,
        error: { message: 'channelName, userUid, and token are required' },
      });
    }

    const agentName = `intentio-agent-${Date.now()}`;
    const agentNumericUid = 999999;

    // Generate a dedicated RTC token specifically for the agent (UID 999999)
    const appId = process.env.AGORA_APP_ID;
    const appCertificate = process.env.AGORA_APP_CERTIFICATE;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + 3600;

    const { RtcTokenBuilder, RtcRole } = require('agora-token');
    const agentToken = RtcTokenBuilder.buildTokenWithUid(
      appId,
      appCertificate,
      channelName,
      agentNumericUid,
      RtcRole.PUBLISHER,
      privilegeExpiredTs,
      privilegeExpiredTs,
    );

    const agentConfig = {
      name: agentName,
      properties: {
        channel: channelName,
        token: agentToken,
        agent_rtc_uid: String(agentNumericUid),
        remote_rtc_uids: ['*'],
        idle_timeout: 30,
        greeting_message: GREETING_TEXT,

        // Agora v2.9: Enable RTM for state notifications
        advanced_features: {
          enable_rtm: true,
        },

        // ASR configuration — Agora ASR
        asr: {
          vendor: 'agora',
          params: {
            language: 'en-US',
          },
        },

        // LLM configuration — OpenAI GPT-4o
        llm: {
          vendor: 'openai',
          params: {
            model: 'gpt-4o',
          },
          greeting_message: GREETING_TEXT,
          system_messages: [
            { role: 'system', content: INTENTIO_SYSTEM_PROMPT },
          ],
        },

        // TTS configuration — OpenAI TTS
        tts: {
          vendor: 'openai',
          params: {
            model: 'tts-1',
            voice: 'nova',
          },
        },
      },
    };

    // Attach MCP tool server only if a public URL is configured
    if (process.env.MCP_PUBLIC_URL) {
      agentConfig.properties.advanced_features.enable_tools = true;
      agentConfig.properties.mcp = {
        url: `${process.env.MCP_PUBLIC_URL}/mcp`,
        tools: [
          'searchFlights',
          'bookFlight',
          'addCalendarEvent',
          'checkAvailability',
          'getWeather',
        ],
      };
    }

    const response = await axios.post(
      `${getAgoraApiBase()}/join`,
      agentConfig,
      { headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' } },
    );

    const agentId = response.data?.agent_id || agentName;
    const agentUid = response.data?.agent_rtc_uid || String(agentNumericUid);

    // Store session
    activeSessions.set(agentId, {
      agentId,
      agentUid,
      channelName,
      userUid,
      startTime: Date.now(),
    });

    console.log(`[AgentController] Started agent=${agentId} in channel=${channelName}`);

    return res.json({
      success: true,
      agentId,
      agentUid,
      message: 'Agent started successfully',
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/agent/stop
 * Stops the active Intentio agent and removes it from the channel.
 */
router.post('/stop', async (req, res, next) => {
  try {
    const { agentId } = req.body;

    if (!agentId) {
      return res.status(400).json({
        success: false,
        error: { message: 'agentId is required' },
      });
    }

    try {
      await axios.post(
        `${getAgoraApiBase()}/agents/${agentId}/leave`,
        {},
        { headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' } },
      );
    } catch (leaveErr) {
      console.warn(
        `[AgentController] Agora leave info for agent=${agentId}:`,
        leaveErr.response?.data || leaveErr.message,
      );
    }

    activeSessions.delete(agentId);
    console.log(`[AgentController] Stopped agent=${agentId}`);

    return res.json({ success: true, message: 'Agent stopped successfully' });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/agent/status
 * Returns the current status of an agent session.
 */
router.get('/status', (req, res) => {
  const { agentId } = req.query;

  if (agentId && activeSessions.has(agentId)) {
    const session = activeSessions.get(agentId);
    return res.json({
      status: 'running',
      agentId: session.agentId,
      uptime: Math.floor((Date.now() - session.startTime) / 1000),
    });
  }

  return res.json({ status: 'stopped' });
});

module.exports = router;
