# AGENTS.md

## Purpose

This file provides the core blueprint for the Intentio agent and ensures that any AI coding assistant consistently builds Intentio using the latest Agora Conversational AI Engine v2.9 features, while leveraging free resources and best practices .

---

## 1. Agent Identity & System Prompt

The following system prompt defines the Intentio agent's core personality and behavior:

```
You are Intentio, an autonomous voice-first mobile agent that replaces app-based navigation with conversational intent understanding.

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
- Listen → User speaks naturally → The user's intent is understood → Workflow is planned → Actions are executed → A voice response is provided
- When you call MCP tools (e.g., flight booking API), use filler words like "Let me check that for you..." to maintain a natural conversation flow
- If the user interrupts, listen and adapt
```

---

## 2. Technical Configuration

### 2.1 Managed Mode (Free ASR + LLM + TTS)

To keep the build free, Intentio uses **Managed Mode** for all AI services. This means Agora provides the credentials for Deepgram ASR, OpenAI GPT, and OpenAI TTS—no separate API keys are needed .

**Critical:** Set `credential_mode` to `"managed"` in the `asr`, `llm`, and `tts` blocks when starting the agent .

### 2.2 Key v2.9 Features to Use

The agent must use these brand new Agora v2.9 features released July 2026 :

| Feature | Configuration | Purpose |
|---|---|---|
| **Manual Turn Control** | `start_of_speech.mode: "manual"`, `end_of_speech.mode: "manual"` | For structured workflows (booking, interviews) or push-to-talk scenarios |
| **Agent State Notifications over RTM** | `advanced_features.enable_rtm: true` | Drive real-time UI: "Listening..." "Thinking..." "Speaking..." |
| **Pre-recorded Greeting Audio** | `greeting_audio_url: "https://..."` | Professional, polished experience with TTS fallback |
| **Managed Mode** | `credential_mode: "managed"` | All ASR, LLM, TTS services are free to use |

### 2.3 Greeting Audio Setup

```
Pre-recorded greeting URL: https://intentio-assets.s3.amazonaws.com/greeting.mp3
Fallback greeting text: "Hello! I'm Intentio. What can I do for you today?"
```

If the audio fails, the agent automatically falls back to TTS synthesis using `greeting_message` .

**Voice Greeting Script:**
> "Hello! I'm Intentio—your autonomous mobile agent. Just tell me what you need, and I'll handle the rest. For example, say: 'Book a flight to London next Tuesday' or 'Schedule a meeting with the team.' Go ahead—what's your intent?"

### 2.4 ASR Configuration (Deepgram via Managed Mode)

```json
{
  "asr": {
    "vendor": "deepgram",
    "credential_mode": "managed",
    "params": {
      "language": "en",
      "model": "nova-3"
    }
  }
}
```

Deepgram provides fast, accurate automatic speech recognition optimized for real-time streaming and conversational applications .

### 2.5 LLM Configuration (OpenAI via Managed Mode)

```json
{
  "llm": {
    "vendor": "openai",
    "credential_mode": "managed",
    "params": {
      "model": "gpt-4o"
    },
    "system_messages": [
      {
        "role": "system",
        "content": "[Insert System Prompt from Section 1]"
      }
    ],
    "greeting_message": "Hello! I'm Intentio—your autonomous mobile agent. Just tell me what you need, and I'll handle the rest.",
    "failure_message": "I'm sorry, I encountered an issue. Could you please repeat that?"
  }
}
```

The `greeting_message` field is now required as a fallback when `greeting_audio_url` is configured .

### 2.6 TTS Configuration (OpenAI via Managed Mode)

```json
{
  "tts": {
    "vendor": "openai",
    "credential_mode": "managed",
    "params": {
      "model": "tts-1-hd",
      "voice": "nova",
      "speed": 1.0
    }
  }
}
```

OpenAI provides natural-sounding text-to-speech with customizable voice instructions .

### 2.7 MCP Tool Calling

**Note:** This description describes a technical concept. To enable tool invocation, set `advanced_features.enable_tools` to `true` and connect an MCP server .

The Intentio agent can call external APIs via MCP (Model Context Protocol) server integration. This enables actions like flight booking, calendar management, and weather queries .

**MCP Server Configuration:**
```json
{
  "mcp": {
    "url": "https://mcp.intentio.example.com",
    "tools": ["flight_booking", "calendar", "weather"]
  }
}
```

---

## 3. Agent Startup Flow

1. **User joins** an Agora RTC channel
2. **Business server** calls the `/join` endpoint to start the agent
3. **Agent joins** the same channel using the provided token 
4. **Agent plays** the pre-recorded greeting (or falls back to TTS)
5. **Agent listens** for user speech (with optional manual turn control)
6. **Agent processes** speech via ASR → LLM → TTS pipeline
7. **Agent calls** MCP tools when needed (flights, calendars, etc.)
8. **Agent responds** with natural voice output
9. **Session ends** when the business server calls `/leave`

---

## 4. Token & Authentication

- The `token` field must include **both RTC and RTM privileges** when RTM is enabled 
- Generate tokens server-side—never expose App Certificate in client code
- For `agent_rtc_uid`, use `0` to let Agora assign a unique random UID 

---

## 5. API Request Example (Start Agent)

```curl
POST https://api.agora.io/api/conversational-ai-agent/v2/projects/{appid}/join

{
  "name": "intentio-agent-session-001",
  "properties": {
    "channel": "intentio-demo-channel",
    "token": "<RTC+RTM_TOKEN>",
    "agent_rtc_uid": "0",
    "remote_rtc_uids": ["123456"],
    "idle_timeout": 30,
    "advanced_features": {
      "enable_rtm": true,
      "enable_tools": true
    },
    "asr": {
      "vendor": "deepgram",
      "credential_mode": "managed",
      "params": {
        "language": "en",
        "model": "nova-3"
      }
    },
    "llm": {
      "vendor": "openai",
      "credential_mode": "managed",
      "params": {
        "model": "gpt-4o"
      },
      "system_messages": [
        {
          "role": "system",
          "content": "<SYSTEM_PROMPT_FROM_SECTION_1>"
        }
      ],
      "greeting_message": "Hello! I'm Intentio. What can I do for you today?",
      "failure_message": "I'm sorry, I encountered an issue. Could you please repeat that?"
    },
    "tts": {
      "vendor": "openai",
      "credential_mode": "managed",
      "params": {
        "model": "tts-1-hd",
        "voice": "nova",
        "speed": 1.0
      }
    }
  }
}
```

---

## 6. Test & Validate

### What to Test :

| Check | How |
|---|---|
| **ASR Accuracy** | Speak clearly and verify transcription |
| **LLM Responses** | Confirm appropriate, contextual responses |
| **TTS Quality** | Listen for natural, clear voice output |
| **Conversation Flow** | Test multi-turn conversations |
| **MCP Tools** | Trigger API calls and verify responses |
| **Interruption Handling** | Interrupt mid-sentence—works naturally |
| **Manual Turn Control** | Test push-to-talk and structured workflows |

---

## 7. Best Practices

1. **Always use Managed Mode** for free ASR + LLM + TTS 
2. **Enable RTM** for real-time state notifications that drive the UI 
3. **Use pre-recorded greeting** for polished experience with TTS fallback 
4. **Add filler words** during MCP tool calls for natural experience
5. **Test exhaustively** before recording your demo 
6. **The 300 AI Engine minutes are ONE-TIME**—use them only for final testing and demo recording

---

## 8. Summary

**Intentio** uses **Agora Conversational AI Engine v2.9** with **Managed Mode** for free ASR (Deepgram), LLM (OpenAI GPT), and TTS (OpenAI TTS). It leverages **Manual Turn Control**, **RTM State Notifications**, **Pre-recorded Greeting Audio**, and **MCP Tool Calling** to deliver a polished, autonomous voice agent experience that wins hackathons.