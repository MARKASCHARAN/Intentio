# 📐 Intentio — Technical Specification

**Version:** 1.0  
**Date:** 2026-07-31  
**Author:** @pm (Product Manager)  
**Status:** 🔴 AWAITING USER APPROVAL  
**Hackathon:** EchoSphere: Agora Conversational AI Hackathon

---

## 1. Executive Summary

### Problem

Modern mobile users interact through a fragmented ecosystem of 80+ apps, navigating menus and screens hundreds of times a day. Voice assistants (Siri, Alexa, Google Assistant) offer no relief — they are **command-response voice remote controls**, not autonomous agents. They cannot handle complex workflows, cannot call arbitrary external APIs, and cannot reason about a user's underlying *intent*.

### Solution

**Intentio** is a **voice-first autonomous mobile agent** that replaces app-based navigation with conversational intent understanding. The user speaks a goal — *"Book a flight to London next Tuesday and add it to my calendar"* — and Intentio reasons, plans, and executes the entire workflow: searching flights, selecting the best option, booking it, and creating a calendar event. All by voice. All autonomously.

### Competitive Positioning

| Dimension | Siri / Alexa / Google | Intentio |
|---|---|---|
| Interaction model | Command-response | Intent-driven, autonomous |
| Multi-step workflows | ❌ | ✅ Chains API calls |
| External API access | First-party only | ✅ Any API via MCP |
| Real-time interruption | ❌ | ✅ Natural |
| Transport | WebSocket (high latency) | ✅ UDP SDRTN (<650ms) |
| Cost to build | High (API keys) | ✅ Free (Managed Mode) |

### Hackathon Differentiator

Intentio is the **only entry in EchoSphere that uses all four brand-new Agora v2.9 features** (released July 2026):

1. **Managed Mode** — Free ASR + LLM + TTS, no external API keys
2. **Manual Turn Control** — SoS/EoS over RTM for push-to-talk
3. **Agent State Notifications over RTM** — Real-time Listening/Thinking/Speaking UI
4. **Pre-recorded Greeting Audio** — Professional experience with TTS fallback

---

## 2. Requirements

### 2.1 Functional Requirements

#### FR-01: Voice Conversation
- The app MUST allow a user to speak naturally into the microphone and receive a spoken AI response
- End-to-end latency target: **< 650ms** from end of user speech to start of agent response audio
- The agent MUST maintain conversation context across multiple turns in a session

#### FR-02: Agent Session Lifecycle
- The app MUST allow the user to start an agent session with a single tap
- On session start, the agent MUST play a pre-recorded greeting (`greeting_audio_url`)
- If greeting audio fails to load, the system MUST fall back to TTS synthesis of `greeting_message`
- The app MUST allow the user to cleanly end the session (agent leaves channel, RTC disconnects)

#### FR-03: Manual Turn Control (Agora v2.9)
- The app MUST support push-to-talk mode using Manual Turn Control
- On push-to-talk press: send `Start of Speech (SoS)` message over RTM
- On push-to-talk release: send `End of Speech (EoS)` message over RTM
- Both ASR auto-detection (VAD) and manual turn control modes MUST be supported

#### FR-04: Agent State Notifications (Agora v2.9)
- The app MUST subscribe to RTM messages and receive agent state events:
  - `state.listening` → show green "Listening..." indicator
  - `state.thinking` → show amber "Thinking..." indicator
  - `state.speaking` → show blue "Speaking..." indicator
  - Idle / disconnected → show neutral state
- State transitions MUST animate smoothly (no jarring UI jumps)

#### FR-05: Managed Mode (Agora v2.9)
- ALL AI services (ASR, LLM, TTS) MUST use `credential_mode: "managed"`
- The backend MUST NOT store or transmit personal OpenAI or Deepgram API keys
- ASR: Deepgram `nova-3`, language `en`
- LLM: OpenAI `gpt-4o` with the Intentio system prompt
- TTS: OpenAI `tts-1-hd`, voice `nova`, speed `1.0`

#### FR-06: MCP Tool Calling
- The agent MUST be able to call external tools via a connected MCP server
- Required tools at MVP: `searchFlights`, `bookFlight`, `addCalendarEvent`, `checkAvailability`, `getWeather`
- During tool execution, the agent MUST use filler speech ("Let me check that for you...")
- Tool responses MUST be incorporated into the agent's spoken reply

#### FR-07: Token Generation
- The backend MUST generate Agora tokens server-side (never in client code)
- Tokens MUST carry **both RTC and RTM privileges** (since RTM is enabled)
- Token endpoint: `POST /api/token`
- Token expiry: 3600 seconds (configurable via `.env`)

#### FR-08: Transcript Display
- The app MUST display a real-time conversation transcript
- User messages and agent responses MUST be visually distinct
- The transcript MUST auto-scroll to the latest message

#### FR-09: Permissions
- The app MUST request `RECORD_AUDIO` permission on Android before joining the channel
- The app MUST request microphone permission on iOS
- If permission is denied, the app MUST show a clear, actionable error message

#### FR-10: Settings
- The user MUST be able to toggle between Auto-listen (VAD) and Push-to-talk mode
- The settings screen MUST display estimated remaining AI Engine minutes (local counter)

### 2.2 Non-Functional Requirements

| ID | Category | Requirement |
|---|---|---|
| NFR-01 | Performance | End-to-end voice latency ≤ 650ms (Agora SDRTN UDP transport) |
| NFR-02 | Reliability | App MUST handle network loss gracefully — show reconnecting UI, auto-reconnect |
| NFR-03 | Security | App Certificate MUST NEVER appear in client-side code |
| NFR-04 | Scalability | Backend MUST be stateless — agent sessions managed by Agora, not server memory |
| NFR-05 | Cost | ALL AI services MUST use Managed Mode to stay within free tier |
| NFR-06 | Cross-platform | All code MUST be cross-platform (iOS + Android) via React Native |
| NFR-07 | Accessibility | Microphone button MUST have clear accessibility labels |
| NFR-08 | Code Quality | TypeScript strict mode; no `any` types; all async functions use try/catch |
| NFR-09 | Resilience | App MUST handle agent idle timeout (30s) — notify user and offer restart |
| NFR-10 | Testing | Primary test device: Android physical phone |

---

## 3. Tech Stack

### 3.1 Frontend (Mobile App)

| Component | Technology | Version | Notes |
|---|---|---|---|
| Mobile framework | React Native | 0.73+ | TypeScript template |
| Language | TypeScript | 5.x | Strict mode |
| Voice SDK | react-native-agora | 4.x | RTC + RTM |
| Navigation | React Navigation | 6.x | Stack + Tab navigators |
| State management | React Context + Hooks | — | No Redux needed at MVP |
| Animations | React Native Animated | — | Built-in |

### 3.2 Backend (Business Server)

| Component | Technology | Version | Notes |
|---|---|---|---|
| Runtime | Node.js | 18 LTS | |
| Framework | Express.js | 4.x | |
| Token generation | agora-token | latest | `RtcTokenBuilder` |
| HTTP client | axios | 1.x | For Agora REST API calls |
| Environment | dotenv | 16.x | |
| Dev tooling | nodemon | 3.x | Auto-restart in dev |
| MCP server | Custom Express routes | — | Exposes tools as HTTP endpoints |

### 3.3 AI Services (All via Managed Mode — FREE)

| Service | Provider | Model | Credential Mode |
|---|---|---|---|
| ASR (Speech-to-Text) | Deepgram | nova-3 | `managed` |
| LLM (Reasoning) | OpenAI | gpt-4o | `managed` |
| TTS (Text-to-Speech) | OpenAI | tts-1-hd, nova | `managed` |

### 3.4 Infrastructure

| Resource | Free Tier | Usage Policy |
|---|---|---|
| Agora RTC | 10,000 min/month | Safe for all testing |
| Agora Conversational AI Engine | 300 min ONE-TIME | Final demo + recording ONLY |
| Backend hosting | Localhost (dev) / Render/Vercel (prod) | |

> ⚠️ **CRITICAL CONSTRAINT**: The 300 AI Engine minutes are one-time. All development testing should use mocked agent responses or minimal calls. Reserve for final demo recording.

---

## 4. System Architecture

### 4.1 High-Level Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                    REACT NATIVE MOBILE APP                           │
│                                                                      │
│  ┌─────────────┐   ┌──────────────────┐   ┌──────────────────────┐  │
│  │  UI Layer   │   │  Agora RTC SDK   │   │   Agora RTM SDK      │  │
│  │             │   │  (Audio stream)  │   │   (State events      │  │
│  │ HomeScreen  │   │                  │   │    + Turn control)   │  │
│  │ ChatScreen  │   │                  │   │                      │  │
│  │ Settings    │   └──────────────────┘   └──────────────────────┘  │
│  └─────────────┘                                                     │
└──────────────────────────┬────────────────────────┬─────────────────┘
                           │ Agora SDRTN (UDP)       │ RTM WebSocket
                           ▼                         ▼
              ┌────────────────────────────────────────────┐
              │          AGORA CLOUD INFRASTRUCTURE         │
              │                                            │
              │  ┌──────────────────────────────────────┐  │
              │  │   Agora Conversational AI Engine v2.9 │  │
              │  │  Deepgram ASR → OpenAI GPT → OAI TTS  │  │
              │  │  (Managed Mode — No API Keys Needed)   │  │
              │  │                  │                    │  │
              │  │                  ▼                    │  │
              │  │         ┌──────────────┐              │  │
              │  │         │  MCP Client  │              │  │
              │  └─────────┴──────┬───────┴──────────────┘  │
              └──────────────────────────────────────────────┘
                                  │ HTTP (Tool calls)
                                  ▼
              ┌────────────────────────────────────────────┐
              │            NODE.JS BUSINESS SERVER          │
              │  POST /api/token       (Token generation)  │
              │  POST /api/agent/start  (Start agent)      │
              │  POST /api/agent/stop   (Stop agent)       │
              │  GET  /api/agent/status (Agent status)     │
              │                                            │
              │  ┌──────────────────────────────────────┐  │
              │  │           MCP SERVER                  │  │
              │  │  /tools/searchFlights                 │  │
              │  │  /tools/bookFlight                    │  │
              │  │  /tools/addCalendarEvent              │  │
              │  │  /tools/getWeather                    │  │
              │  └──────────────────────────────────────┘  │
              └──────────────────────────┬─────────────────┘
                                         │
                                         ▼
                          External APIs (mock at MVP)
```

### 4.2 Data Flow: Voice Conversation Turn

```
1.  User presses mic button → SoS sent via RTM (manual turn control)
2.  User speaks            → RTC streams audio to Agora SDRTN
3.  Agora feeds audio to Deepgram ASR (Managed Mode) → transcription
4.  Transcription sent to OpenAI GPT-4o (Managed Mode)
5.  GPT-4o reasons about intent → decides if tool call needed
6a. If tool needed: calls MCP server → gets result → incorporates
6b. If no tool: generates response text directly
7.  Response text sent to OpenAI TTS nova (Managed Mode) → audio
8.  Audio streamed back via Agora RTC → plays in user's ear
9.  RTM pushes state events (listening/thinking/speaking) → UI updates
10. EoS sent via RTM → agent knows turn is complete
```

### 4.3 RTM Message Schema

```typescript
interface AgentStateMessage {
  type: 'state.listening' | 'state.thinking' | 'state.speaking' | 'state.idle';
  timestamp: number;
  agentUid: string;
}

interface TurnControlMessage {
  type: 'sos' | 'eos';  // Start of Speech / End of Speech
  userId: string;
  timestamp: number;
}
```

---

## 5. Detailed File Architecture

### 5.1 Frontend (`src/`)

```
src/
├── App.tsx                          # Root: navigation + engine init
├── index.ts                         # App registration
├── components/
│   ├── AgentVisualizer.tsx          # Animated orb: idle/listening/thinking/speaking
│   ├── MicButton.tsx                # Push-to-talk button with haptic feedback
│   ├── TranscriptDisplay.tsx        # Scrollable conversation list
│   ├── StateIndicator.tsx           # Text label: "Listening...", "Thinking..."
│   ├── Header.tsx                   # App bar with connection status
│   └── styles.ts                    # Design tokens (colors, typography, spacing)
├── screens/
│   ├── HomeScreen.tsx               # Welcome + "Start Session" CTA
│   ├── ChatScreen.tsx               # Main conversation view
│   └── SettingsScreen.tsx           # Toggle VAD/PTT, view usage
├── hooks/
│   ├── useAgoraEngine.ts            # RTC engine init, join/leave, event handlers
│   ├── useAgentState.ts             # RTM subscription → state machine
│   └── usePermissions.ts            # Android/iOS microphone permission flow
├── services/
│   ├── apiClient.ts                 # Axios instance with base URL + interceptors
│   ├── tokenService.ts              # POST /api/token → returns RTC+RTM token
│   └── agentService.ts              # start/stop/status agent via backend
├── utils/
│   ├── constants.ts                 # AGORA_APP_ID, CHANNEL_NAME, API_BASE_URL
│   ├── logger.ts                    # Structured debug logging (dev only)
│   └── permissions.ts               # Permission request helpers
└── types/
    ├── agent.ts                     # AgentState, AgentStateMessage types
    ├── rtc.ts                       # RTC event types, ChannelProfile
    └── api.ts                       # TokenRequest, AgentStartRequest, etc.
```

### 5.2 Backend (`backend/`)

```
backend/
├── server.js                        # Express app entry + middleware + routes
├── package.json
├── .env                             # Credentials (gitignored)
├── .env.example                     # Template for developers
├── routes/
│   ├── token.js                     # POST /api/token
│   └── agent.js                     # POST /api/agent/start|stop, GET /status
├── controllers/
│   ├── tokenController.js           # RtcTokenBuilder logic
│   └── agentController.js           # Agora REST API calls (join/leave)
├── middleware/
│   └── errorHandler.js              # Centralized error handling
└── mcp/
    ├── index.js                     # MCP server Express sub-app
    ├── mcpConfig.json               # Tool registry (names, schemas)
    └── tools/
        ├── flightBooking.js         # searchFlights(), bookFlight()
        ├── calendar.js              # addEvent(), checkAvailability()
        └── weather.js               # getWeather()
```

---

## 6. Key API Contracts

### 6.1 Token Endpoint

```http
POST /api/token
{ "channelName": "intentio-demo-channel", "uid": 123456, "role": "publisher" }

Response:
{ "token": "<RTC_TOKEN>", "rtmToken": "<RTM_TOKEN>", "expiresIn": 3600 }
```

### 6.2 Start Agent Payload (sent to Agora)

```json
{
  "name": "intentio-agent-{timestamp}",
  "properties": {
    "channel": "intentio-demo-channel",
    "token": "<RTC+RTM_TOKEN>",
    "agent_rtc_uid": "0",
    "idle_timeout": 30,
    "greeting_audio_url": "https://intentio-assets.s3.amazonaws.com/greeting.mp3",
    "advanced_features": { "enable_rtm": true, "enable_tools": true },
    "asr": { "vendor": "deepgram", "credential_mode": "managed", "params": { "language": "en", "model": "nova-3" } },
    "llm": { "vendor": "openai", "credential_mode": "managed", "params": { "model": "gpt-4o" }, "greeting_message": "Hello! I'm Intentio. What can I do for you today?" },
    "tts": { "vendor": "openai", "credential_mode": "managed", "params": { "model": "tts-1-hd", "voice": "nova", "speed": 1.0 } },
    "mcp": { "url": "http://YOUR_SERVER/mcp", "tools": ["searchFlights", "bookFlight", "addCalendarEvent", "getWeather"] }
  }
}
```

### 6.3 MCP Tool Schemas (MVP)

| Tool | Required Params |
|---|---|
| `searchFlights` | `origin` (IATA), `destination` (IATA), `date` (ISO 8601) |
| `bookFlight` | `flightId`, `passengerName`, `email` |
| `addCalendarEvent` | `title`, `date`, `time`, `duration` |
| `getWeather` | `city`, `days` (1–7) |

---

## 7. UI Design Specification

### 7.1 Design Tokens

```typescript
export const Colors = {
  background:    '#0A0A0F',  // Deep space black
  surface:       '#13131A',  // Card/surface
  accent:        '#00BCD4',  // Teal (agent brand)
  highlight:     '#FF6F00',  // Amber (CTAs)
  listening:     '#00E676',  // Vivid green
  thinking:      '#FF9100',  // Vivid amber
  speaking:      '#448AFF',  // Electric blue
  textPrimary:   '#FFFFFF',
  textSecondary: '#9E9E9E',
};
```

### 7.2 AgentVisualizer States

| State | Animation |
|---|---|
| Idle | Static grey orb, 80px |
| Listening | Green pulse ring, 800ms loop |
| Thinking | Amber rotating arc spinner |
| Speaking | Blue expanding concentric rings |

---

## 8. Development Timeline (8 Phases)

| Phase | Focus | Duration |
|---|---|---|
| 1 | React Native project init + Android setup | Day 1, ~4 hrs |
| 2 | Backend server + token + agent endpoints | Day 1, ~3 hrs |
| 3 | Voice core — RTC engine, permissions, services | Day 2, ~4 hrs |
| 4 | Agora v2.9 features — RTM states, turn control, greeting | Day 2, ~3 hrs |
| 5 | MCP tools — flight, calendar, weather | Day 3, ~4 hrs |
| 6 | UI polish — dark mode, animations, transcript | Day 3, ~3 hrs |
| 7 | Demo recording (300 min used here) | Day 4, ~2 hrs |
| 8 | GitHub push + submission | Day 4, ~1 hr |

---

## 9. Environment Variables

```env
# Backend .env (NEVER commit)
AGORA_APP_ID=your_agora_app_id
AGORA_APP_CERTIFICATE=your_app_certificate
AGORA_API_KEY=your_agora_rest_api_key
AGORA_API_SECRET=your_agora_rest_api_secret
PORT=3000
MCP_PORT=3001
TOKEN_EXPIRY_SECONDS=3600
```

---

## 10. Risk Register

| Risk | Severity | Mitigation |
|---|---|---|
| 300 AI minutes exhausted early | 🔴 Critical | Use only for final demo; all dev uses curl mocks |
| Android permissions denied | 🟡 Medium | Rationale UI + deep-link to Android settings |
| RTM state events missing | 🟡 Medium | Log all RTM; poll `/api/agent/status` as fallback |
| MCP server not reachable | 🟡 Medium | Use ngrok dev / Render prod for public URL |
| Agent idle timeout in demo | 🟡 Medium | Keep conversation active; 30s timeout configured |

---

## 11. Testing Checklist

| Test | Expected Result |
|---|---|
| App launches | HomeScreen renders without crash |
| Microphone permission | Dialog appears, granted/denied handled |
| `POST /api/token` | Returns valid RTC + RTM token |
| Tap Start Session | Agent joins, greeting audio plays |
| Speak naturally | Agent responds within 650ms |
| State UI | Listening → Thinking → Speaking animations |
| Push-to-talk | SoS/EoS controls turns correctly |
| Interrupt mid-speech | Agent stops and listens |
| "Weather in London?" | Tool called, weather response spoken |
| Tap End | Agent leaves, HomeScreen shown |
| WiFi off mid-session | Reconnecting UI shown |

---

*Generated by @pm — Intentio Technical Team*  
*Next step: @engineer executes `rn_setup` + `backend_setup` skills upon your approval.*
