# 📋 Intentio - Complete Project Checklist

## Project Overview
**Project Name:** Intentio  
**Tagline:** *"Speak your intent. We act."*  
**Track:** Open Innovation  
**Tech Stack:** React Native + Agora Conversational AI Engine v2.9

---

## ✅ PHASE 1: Foundation & Audio Setup

### 1.1 React Native Project Setup
- [ ] Initialize React Native project with TypeScript template
- [ ] Install `react-native-agora` SDK
- [ ] Install iOS dependencies (`cd ios && pod install`)
- [ ] Install Android dependencies (automatic with React Native)
- [ ] Set up folder structure (src/components, screens, hooks, services, utils, types)
- [ ] Configure TypeScript (`tsconfig.json`)
- [ ] Configure ESLint/Prettier

### 1.2 Android Permissions
- [ ] Add `RECORD_AUDIO` permission to `AndroidManifest.xml`
- [ ] Add `BLUETOOTH_CONNECT` permission
- [ ] Add `INTERNET` permission
- [ ] Test permissions on Android device

### 1.3 iOS Permissions
- [ ] Add microphone usage description to `Info.plist`
- [ ] (Skip if no Mac — note iOS compatibility)

### 1.4 Agora Engine Integration
- [ ] Create Agora account → Get App ID
- [ ] Get App Certificate (for token generation)
- [ ] Initialize Agora RTC engine in app
- [ ] Register event handlers (`onJoinChannelSuccess`, `onUserJoined`, etc.)
- [ ] Configure audio scenario (`AUDIO_SCENARIO_AI_CLIENT`)
- [ ] Test join/leave channel with sample token

### 1.5 Basic UI Components
- [ ] Home screen with "Start" button
- [ ] Chat screen with audio controls
- [ ] Join/Leave channel buttons

---

## ✅ PHASE 2: Backend Server Setup

### 2.1 Server Foundation
- [ ] Create `backend` folder
- [ ] Initialize Node.js project (`npm init -y`)
- [ ] Install dependencies:
  - [ ] `express` — web server
  - [ ] `cors` — cross-origin requests
  - [ ] `dotenv` — environment variables
  - [ ] `axios` — HTTP requests to Agora API
  - [ ] `agora-token` — token generation
  - [ ] `nodemon` (dev dependency) — auto-restart

### 2.2 Environment Configuration
- [ ] Create `.env` file with:
  - [ ] `AGORA_APP_ID`
  - [ ] `AGORA_APP_CERTIFICATE`
  - [ ] `AGORA_API_KEY` (from Agora Console)
  - [ ] `PORT` (3000 or similar)
- [ ] Create `.env.example` for reference

### 2.3 Token Endpoint
- [ ] Create `routes/token.js`
- [ ] Implement POST `/api/token` endpoint
- [ ] Generate RTC token with `RtcTokenBuilder`
- [ ] Include both RTC and RTM privileges (since we use RTM)
- [ ] Test with Postman

### 2.4 Agent Endpoints
- [ ] Create `routes/agent.js`
- [ ] Implement POST `/api/agent/start` endpoint
- [ ] Call Agora API: `POST /api/conversational-ai-agent/v2/projects/{appid}/join`
- [ ] Implement POST `/api/agent/stop` endpoint
- [ ] Call Agora API: `POST /api/conversational-ai-agent/v2/projects/{appid}/leave`
- [ ] Implement GET `/api/agent/status` endpoint

### 2.5 Agent Configuration (Managed Mode)
- [ ] Configure ASR block:
  - [ ] `vendor: "deepgram"`
  - [ ] `credential_mode: "managed"`
  - [ ] `params: { language: "en", model: "nova-3" }`
- [ ] Configure LLM block:
  - [ ] `vendor: "openai"`
  - [ ] `credential_mode: "managed"`
  - [ ] `params: { model: "gpt-4o" }`
- [ ] Write system prompt (Intentio personality)
- [ ] Set greeting message (TTS fallback)
- [ ] Set failure message
- [ ] Configure TTS block:
  - [ ] `vendor: "openai"`
  - [ ] `credential_mode: "managed"`
  - [ ] `params: { model: "tts-1-hd", voice: "nova", speed: 1.0 }`

### 2.6 RTM & Advanced Features
- [ ] Enable RTM: `advanced_features.enable_rtm: true`
- [ ] Enable tools: `advanced_features.enable_tools: true`
- [ ] Configure idle timeout (30 seconds)
- [ ] Test all endpoints with Postman

---

## ✅ PHASE 3: Frontend-Agent Integration

### 3.1 API Services
- [ ] Create `services/apiClient.ts` — Axios/fetch configuration
- [ ] Create `services/tokenService.ts` — Fetch token from backend
- [ ] Create `services/agentService.ts` — Start/stop agent
- [ ] Create `services/agentService.ts`:
  - [ ] `startAgent()` — calls `/api/agent/start`
  - [ ] `stopAgent()` — calls `/api/agent/stop`
  - [ ] `getAgentStatus()` — calls `/api/agent/status`

### 3.2 Custom Hooks
- [ ] Create `hooks/usePermissions.ts` — Request and check microphone permissions
- [ ] Create `hooks/useAgoraEngine.ts` — Initialize and manage RTC engine
- [ ] Create `hooks/useAgentState.ts` — Subscribe to RTM state events

### 3.3 Connection Flow
- [ ] Request microphone permissions on app launch
- [ ] Initialize Agora engine
- [ ] Fetch token from backend
- [ ] Join RTC channel with token
- [ ] Start agent via backend API
- [ ] Confirm agent joins channel (via `onUserJoined`)
- [ ] Handle disconnection cleanly
- [ ] Stop agent on leaving channel

### 3.4 Basic Voice Test
- [ ] Speak into microphone → Voice transmitted
- [ ] Agent responds with voice → Audio plays back
- [ ] Transcript appears (text only)
- [ ] Basic error handling

---

## ✅ PHASE 4: Core Features (Agora v2.9)

### 4.1 Manual Turn Control
- [ ] Implement push-to-talk mode
- [ ] Send SoS (Start of Speech) via RTM
- [ ] Send EoS (End of Speech) via RTM
- [ ] Test structured conversation flow

### 4.2 Agent State Notifications (RTM)
- [ ] Subscribe to RTM channel events
- [ ] Listen for `state.listening` event → Update UI
- [ ] Listen for `state.thinking` event → Update UI
- [ ] Listen for `state.speaking` event → Update UI
- [ ] Update UI in real-time with state changes

### 4.3 Pre-recorded Greeting Audio
- [ ] Create greeting audio file (MP3)
- [ ] Host audio file on cloud (S3, Firebase, or public URL)
- [ ] Set `greeting_audio_url` in agent config
- [ ] Set `greeting_message` as TTS fallback
- [ ] Test: Agent plays greeting on join
- [ ] Test: If audio fails, TTS fallback works

### 4.4 Intelligent Interruption Handling
- [ ] Test: User speaks while AI is talking → AI stops and listens
- [ ] Test: Auto-detection of speech via VAD works
- [ ] Test: Manual interruption via button works

### 4.5 Noise Suppression
- [ ] Configure noise suppression in Agora RTC
- [ ] Test in noisy environment (cafe, street, etc.)
- [ ] Verify audio quality

### 4.6 Filler Words
- [ ] Add filler words during MCP tool calls: "Let me check that for you..."
- [ ] Test: Agent uses filler words during long operations

---

## ✅ PHASE 5: MCP Tool Calling

### 5.1 MCP Server Setup
- [ ] Create `backend/mcp/` folder
- [ ] Create `backend/mcp/index.js` — MCP server entry
- [ ] Install MCP dependencies (if needed)
- [ ] Configure MCP server URL in agent config

### 5.2 Flight Booking Tool
- [ ] Create `backend/mcp/tools/flightBooking.js`
- [ ] Implement `searchFlights()` function
- [ ] Implement `bookFlight()` function
- [ ] Connect to flight API (mock or real)
- [ ] Register tool in MCP server

### 5.3 Calendar Management Tool
- [ ] Create `backend/mcp/tools/calendar.js`
- [ ] Implement `addEvent()` function
- [ ] Implement `checkAvailability()` function
- [ ] Connect to calendar API (mock or real)
- [ ] Register tool in MCP server

### 5.4 Weather Query Tool
- [ ] Create `backend/mcp/tools/weather.js`
- [ ] Implement `getWeather()` function
- [ ] Connect to weather API (mock or real)
- [ ] Register tool in MCP server

### 5.5 Tool Testing
- [ ] Test: Agent calls flight booking tool → Returns results
- [ ] Test: Agent calls calendar tool → Adds/checks events
- [ ] Test: Agent calls weather tool → Returns weather
- [ ] Test: Error handling when API fails

---

## ✅ PHASE 6: UI Components

### 6.1 AgentVisualizer
- [ ] Create `components/AgentVisualizer.tsx`
- [ ] Show agent state with animation (listening/thinking/speaking)
- [ ] Add pulsing animation for listening state
- [ ] Add typing animation for thinking state
- [ ] Add speaking animation for speaking state

### 6.2 StateIndicator
- [ ] Create `components/StateIndicator.tsx`
- [ ] Show "Listening..." text with icon
- [ ] Show "Thinking..." text with icon
- [ ] Show "Speaking..." text with icon
- [ ] Show "Idle" state with icon

### 6.3 MicButton
- [ ] Create `components/MicButton.tsx`
- [ ] Microphone icon with animation
- [ ] Press to talk (push-to-talk mode)
- [ ] Hold to talk (if using hold-to-talk)
- [ ] Visual feedback when recording

### 6.4 TranscriptDisplay
- [ ] Create `components/TranscriptDisplay.tsx`
- [ ] Show conversation history (user + agent)
- [ ] Scrollable list
- [ ] Different styling for user vs agent messages
- [ ] Timestamp display

### 6.5 Header
- [ ] Create `components/Header.tsx`
- [ ] App name: "Intentio"
- [ ] Settings icon
- [ ] Connection status indicator

### 6.6 Home Screen
- [ ] Create `screens/HomeScreen.tsx`
- [ ] Welcome message
- [ ] "Start" button
- [ ] Instructions: "Speak your intent"

### 6.7 Chat Screen
- [ ] Create `screens/ChatScreen.tsx`
- [ ] Header with agent name
- [ ] Transcript display area
- [ ] Mic button at bottom
- [ ] State indicator above mic
- [ ] Leave/End session button

### 6.8 Settings Screen
- [ ] Create `screens/SettingsScreen.tsx`
- [ ] Toggle: Auto-listen / Push-to-talk
- [ ] Toggle: Voice language
- [ ] Display: Remaining AI Engine minutes
- [ ] Button: Clear conversation history

### 6.9 Shared Styles
- [ ] Create `components/styles.ts`
- [ ] Color palette:
  - [ ] Primary: Deep Blue (#1A237E)
  - [ ] Accent: Teal (#00838F)
  - [ ] Highlight: Amber (#FF6F00)
  - [ ] Background: Dark (#121212)
  - [ ] Text: White (#FFFFFF)
  - [ ] Listening: Green (#00E676)
  - [ ] Thinking: Orange (#FF9100)
  - [ ] Speaking: Blue (#448AFF)
- [ ] Typography
- [ ] Spacing
- [ ] Animations

---

## ✅ PHASE 7: Polish & Production Readiness

### 7.1 Error Handling
- [ ] Network error handling
- [ ] Agent failure handling
- [ ] Permission denial handling
- [ ] Token expiry handling
- [ ] User-friendly error messages

### 7.2 Performance
- [ ] Optimize re-renders
- [ ] Reduce bundle size
- [ ] Memory leak prevention
- [ ] Smooth animations (60fps)
- [ ] Fast startup time

### 7.3 Edge Cases
- [ ] Handle agent disconnection
- [ ] Handle network loss
- [ ] Handle low battery mode
- [ ] Handle background/foreground transitions
- [ ] Handle multiple users joining same channel

### 7.4 Testing
- [ ] Test on Android device (physical)
- [ ] Test in quiet environment
- [ ] Test in noisy environment
- [ ] Test voice quality
- [ ] Test interruption handling
- [ ] Test tool calling

---

## ✅ PHASE 8: Documentation

### 8.1 README.md
- [ ] Project name and tagline
- [ ] Overview with emojis/badges
- [ ] Key features
- [ ] Tech stack
- [ ] Why Intentio is different
- [ ] Setup instructions (step-by-step)
- [ ] Environment variables
- [ ] Folder structure
- [ ] Demo script
- [ ] License
- [ ] Acknowledgments
- [ ] Contact information

### 8.2 AGENTS.md
- [ ] Agent system prompt (personality)
- [ ] Technical configuration
- [ ] Managed Mode explanation
- [ ] v2.9 features used
- [ ] API request example
- [ ] Test checklist
- [ ] Best practices

### 8.3 PRD.md
- [ ] Project overview
- [ ] Executive summary (problem + solution)
- [ ] Target users
- [ ] Differentiation (Intentio vs competitors)
- [ ] Technical differentiation (v2.9 features)
- [ ] Product features (core + workflow)
- [ ] Technical architecture
- [ ] Free resources
- [ ] Evaluation strategy

### 8.4 Architecture Diagram
- [ ] Visual diagram showing:
  - [ ] Mobile app (React Native)
  - [ ] Agora RTC SDK
  - [ ] Agora Signaling (RTM)
  - [ ] Business server (Node.js)
  - [ ] Agora Conversational AI Engine v2.9
  - [ ] ASR (Deepgram via Managed Mode)
  - [ ] LLM (OpenAI via Managed Mode)
  - [ ] TTS (OpenAI via Managed Mode)
  - [ ] MCP Server
  - [ ] External APIs

---

## ✅ PHASE 9: Demo & Submission

### 9.1 Demo Preparation
- [ ] Write demo script:
  - [ ] Step 1: Launch app → Clean UI
  - [ ] Step 2: Agent starts → Pre-recorded greeting
  - [ ] Step 3: State updates → Listening → Thinking → Speaking
  - [ ] Step 4: User speaks → "Book a flight to London next Tuesday"
  - [ ] Step 5: AI responds → Confirmation and clarification
  - [ ] Step 6: Tool calling → Flight API query visible
  - [ ] Step 7: Dynamic UI → Flight options shown
  - [ ] Step 8: Complete booking → Voice confirmation
  - [ ] Step 9: Interruption test → Interrupt AI mid-sentence
- [ ] Practice demo (3-5 times until smooth)
- [ ] Record screen capture
- [ ] Record audio narration (clear voice)
- [ ] Edit video (under 5 minutes)
- [ ] Add subtitles/captions (optional)

### 9.2 GitHub Repository
- [ ] All code pushed to GitHub
- [ ] Repository is public
- [ ] README.md is complete
- [ ] AGENTS.md is complete
- [ ] PRD.md is complete
- [ ] Architecture diagram included
- [ ] .gitignore properly configured

### 9.3 Slide Deck (Pitch Presentation)
- [ ] Slide 1: Title + Team
- [ ] Slide 2: Problem → App friction
- [ ] Slide 3: Solution → Intentio overview
- [ ] Slide 4: Why this wins → Differentiation table
- [ ] Slide 5: Technical architecture → Diagram
- [ ] Slide 6: Agora v2.9 features used
- [ ] Slide 7: Demo walkthrough (screenshots)
- [ ] Slide 8: Impact → Who benefits
- [ ] Slide 9: Tech stack
- [ ] Slide 10: Team members
- [ ] Slide 11: Thank you + Contact

### 9.4 Demo Video
- [ ] Screen recording (MP4)
- [ ] Audio narration (clear)
- [ ] Under 5 minutes
- [ ] Shows all key features:
  - [ ] Voice conversation
  - [ ] State notifications
  - [ ] Manual turn control (push-to-talk)
  - [ ] Pre-recorded greeting
  - [ ] Interruption handling
  - [ ] Tool calling
  - [ ] Dynamic UI

### 9.5 Submission Checklist
- [ ] Project name: **Intentio**
- [ ] Tagline: **"Speak your intent. We act."**
- [ ] Track: **Open Innovation**
- [ ] GitHub repository link
- [ ] Demo video link (YouTube, unlisted)
- [ ] Slide deck (PDF or Google Slides)
- [ ] Team member details
- [ ] Agora integration explanation
- [ ] Working demo link (optional)
- [ ] Submit before deadline

---

## 📋 FINAL CHECKLIST (All Phases Combined)

### Project Setup
- [ ] React Native project initialized
- [ ] Agora SDK installed
- [ ] Android permissions configured
- [ ] App ID configured

### Backend
- [ ] Node.js server running
- [ ] Token endpoint working
- [ ] Start/stop agent endpoints working
- [ ] Managed Mode configured (ASR + LLM + TTS)

### Core Features
- [ ] Voice conversation works
- [ ] Agent state notifications (RTM) working
- [ ] Manual turn control working
- [ ] Pre-recorded greeting working
- [ ] Interruption handling working
- [ ] MCP tool calling working

### UI
- [ ] AgentVisualizer works
- [ ] StateIndicator works
- [ ] MicButton works
- [ ] TranscriptDisplay works
- [ ] Settings screen works

### Documentation
- [ ] README.md complete
- [ ] AGENTS.md complete
- [ ] PRD.md complete
- [ ] Architecture diagram done

### Submission
- [ ] Demo video recorded
- [ ] GitHub public
- [ ] Slide deck done
- [ ] All materials submitted
- [ ] Confirmation received

---

## 🎯 Key Success Factors

### What Makes Intentio Win

1. **Paradigm Shift** → Agent, not assistant
2. **Agora v2.9 Features** → Brand new (July 2026) — manual turn control, RTM state notifications, managed mode
3. **Managed Mode** → Completely free to build
4. **MCP Tool Calling** → Any API integration (flights, calendar, weather)
5. **Sub-650ms Latency** → UDP transport, 80% packet loss resilience
6. **Polished UX** → Pre-recorded greeting, state UI, natural interaction

### What Judges Look For

| Criteria | How Intentio Scores |
|---|---|
| **Innovation** | ✅ Voice agent, not assistant — paradigm shift |
| **Technical Implementation** | ✅ Full use of Agora v2.9 features |
| **Voice Experience** | ✅ Natural interruption, sub-650ms latency |
| **Real-world Impact** | ✅ Solves app friction, complex workflows |
| **Product Readiness** | ✅ Polished UI, pre-recorded greeting, state UI |

---

## 📞 Quick Reference

| Resource | Link |
|---|---|
| Agora Console | console.agora.io |
| Agora Docs | docs.agora.io |
| React Native Docs | reactnative.dev |
| React Native Agora | github.com/AgoraIO/react-native-agora |
| Deepgram | deepgram.com |
| OpenAI | openai.com |

---

**Good luck, Team Intentio! 🚀**

*"Speak your intent. We act."*