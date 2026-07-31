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
  return {Authorization: `Basic ${credentials}`};
};

/**
 * Intentio system prompt — defines the agent's personality.
 * Matches the AGENTS.md specification exactly.
 */
const INTENTIO_SYSTEM_PROMPT = `You are Intentio, an autonomous voice-first mobile agent that replaces app-based navigation with conversational intent understanding.

**Your Role:**
- You are a proactive AI agent, not a reactive voice assistant
- You understand user intent (what they actually want), not just commands
- You plan and execute complex, multi-step workflows autonomously
- You can call external APIs (flights, calendars, weather, etc.) via MCP tools

**Your Personality:**
- Friendly, professional, and helpful
- Respond in clear, concise, natural language
- Adapt to user preferences and conversational style
- Handle interruptions gracefully
- Ask clarifying questions when intent is ambiguous

**Your Objectives:**
1. Understand the user's spoken intent
2. Plan the optimal workflow to achieve their goal
3. Execute actions by calling external APIs
4. Provide clear, natural responses with real-time feedback
5. Maintain conversation context across multiple turns

**Interaction Flow:**
- Listen → Understand intent → Plan workflow → Execute actions → Provide voice response
- When calling MCP tools, use filler words like "Let me check that for you..." to maintain natural conversation flow
- If the user interrupts, listen and adapt immediately`;

/**
 * POST /api/agent/start
 *
 * Starts the Intentio AI agent in the specified Agora channel.
 * Uses Agora v2.9 Conversational AI Engine:
 * - ASR: Deepgram / Agora ASR
 * - LLM: OpenAI GPT-4o
 * - TTS: OpenAI TTS (nova)
 * - RTM enabled (for state notifications + manual turn control)
 */
router.post('/start', async (req, res, next) => {
  try {
    const {channelName, userUid, token} = req.body;

    if (!channelName || !userUid || !token) {
      return res.status(400).json({
        success: false,
        error: {message: 'channelName, userUid, and token are required'},
      });
    }

    const agentName = `intentio-agent-${Date.now()}`;
    const agentNumericUid = 999999;

    // Generate a dedicated RTC token specifically for the agent (UID 999999)
    const appId = process.env.AGORA_APP_ID;
    const appCertificate = process.env.AGORA_APP_CERTIFICATE;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + 3600;

    const {RtcTokenBuilder, RtcRole} = require('agora-token');
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

        // Agora v2.9: Enable RTM for state notifications + manual turn control
        advanced_features: {
          enable_rtm: true,
        },

        // ASR configuration — Agora / Deepgram ASR
        asr: {
          vendor: 'agora',
          params: {
            language: 'en',
          },
        },

        // LLM configuration — OpenAI GPT-4o
        llm: {
          vendor: 'openai',
          params: {
            model: 'gpt-4o',
          },
          system_messages: [
            {role: 'system', content: INTENTIO_SYSTEM_PROMPT},
          ],
          greeting_message: "Hello! I'm Intentio—your autonomous mobile agent. Just tell me what you need, and I'll handle the rest.",
          failure_message: "I'm sorry, I encountered an issue. Could you please repeat that?",
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
      {headers: {...getAuthHeaders(), 'Content-Type': 'application/json'}},
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
    const {agentId} = req.body;

    if (!agentId) {
      return res.status(400).json({
        success: false,
        error: {message: 'agentId is required'},
      });
    }

    try {
      await axios.post(
        `${getAgoraApiBase()}/leave`,
        {agent_id: agentId},
        {headers: {...getAuthHeaders(), 'Content-Type': 'application/json'}},
      );
    } catch (leaveErr) {
      console.warn(
        `[AgentController] Agora leave info for agent=${agentId}:`,
        leaveErr.response?.data?.detail || leaveErr.message,
      );
    }

    activeSessions.delete(agentId);
    console.log(`[AgentController] Stopped agent=${agentId}`);

    return res.json({success: true, message: 'Agent stopped successfully'});
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/agent/status
 * Returns the current status of an agent session.
 */
router.get('/status', (req, res) => {
  const {agentId} = req.query;

  if (agentId && activeSessions.has(agentId)) {
    const session = activeSessions.get(agentId);
    return res.json({
      status: 'running',
      agentId: session.agentId,
      uptime: Math.floor((Date.now() - session.startTime) / 1000),
    });
  }

  return res.json({status: 'stopped'});
});

module.exports = router;
