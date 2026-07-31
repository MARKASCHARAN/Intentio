# 🎯 Intentio

<p align="center">
  <img src="https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Native"/>
  <img src="https://img.shields.io/badge/Agora-0093E6?style=for-the-badge&logo=agora&logoColor=white" alt="Agora"/>
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge" alt="Express.js"/>
  <img src="https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white" alt="OpenAI"/>
  <img src="https://img.shields.io/badge/Deepgram-1E90FF?style=for-the-badge&logo=deepgram&logoColor=white" alt="Deepgram"/>
</p>

<p align="center">
  <strong>Speak your intent. We act.</strong>
</p>

<p align="center">
  <em>An autonomous voice-first mobile agent that replaces apps with conversation</em>
</p>

---

## 🚀 Overview

**Intentio** is a voice-first mobile "agent layer" that transforms how you interact with your phone. Instead of navigating through multiple apps, menus, and screens, you simply speak your intent—and Intentio's AI agent autonomously plans and executes complex, multi-step workflows in real-time.

<div align="center">
  <table>
    <tr>
      <td align="center">
        <strong>🎯</strong><br/>
        <strong>Intent-Based</strong>
        <p>Understands your goal, not just commands</p>
      </td>
      <td align="center">
        <strong>🤖</strong><br/>
        <strong>Autonomous Agent</strong>
        <p>Plans and executes workflows independently</p>
      </td>
      <td align="center">
        <strong>⚡</strong><br/>
        <strong>Ultra-Low Latency</strong>
        <p>Sub-650ms response with Agora UDP</p>
      </td>
      <td align="center">
        <strong>🔌</strong><br/>
        <strong>Any API Integration</strong>
        <p>Flights, calendar, weather via MCP</p>
      </td>
    </tr>
  </table>
</div>

---

## 🏆 Why Intentio?

### ❌ What Siri, Alexa, and Google Assistant Can't Do

<p align="center">
  <table>
    <tr>
      <th style="text-align:left;">Siri/Alexa/Google</th>
      <th style="text-align:left;">Intentio</th>
    </tr>
    <tr>
      <td>Reactive — waits for commands</td>
      <td>✅ Proactive — acts autonomously</td>
    </tr>
    <tr>
      <td>Command-response patterns</td>
      <td>✅ Goal-oriented reasoning</td>
    </tr>
    <tr>
      <td>Single-step tasks only</td>
      <td>✅ Complex, multi-step workflows</td>
    </tr>
    <tr>
      <td>Limited to first-party apps</td>
      <td>✅ Any API via MCP server</td>
    </tr>
    <tr>
      <td>WebSocket architecture (high latency)</td>
      <td>✅ UDP SDRTN (sub-650ms latency)</td>
    </tr>
    <tr>
      <td>Cannot handle interruptions well</td>
      <td>✅ Natural interruption handling</td>
    </tr>
  </table>
</p>

> **The Fundamental Distinction:** Siri, Alexa, and Google Assistant are **voice remote controls**. Intentio is an **autonomous digital agent**.

---

## ✨ Features

### 🎯 Core Agent Features (Powered by Agora v2.9)

<table>
  <tr>
    <td align="center"><strong>⚡</strong></td>
    <td><strong>Ultra-Low Latency</strong><br/>650ms response time from end of speech</td>
  </tr>
  <tr>
    <td align="center"><strong>🌐</strong></td>
    <td><strong>UDP-Based Transport</strong><br/>Agora SDRTN with 250+ data centers, 80% packet loss resilience</td>
  </tr>
  <tr>
    <td align="center"><strong>🔄</strong></td>
    <td><strong>Manual Turn Control</strong><br/>Explicit SoS/EoS over RTM for structured workflows</td>
  </tr>
  <tr>
    <td align="center"><strong>📡</strong></td>
    <td><strong>Agent State Notifications</strong><br/>Real-time RTM events: Listening → Thinking → Speaking</td>
  </tr>
  <tr>
    <td align="center"><strong>🎵</strong></td>
    <td><strong>Pre-recorded Greeting</strong><br/>Professional audio with TTS fallback</td>
  </tr>
  <tr>
    <td align="center"><strong>🆓</strong></td>
    <td><strong>Managed Mode</strong><br/>No API keys needed — Deepgram ASR + OpenAI GPT + OpenAI TTS included</td>
  </tr>
  <tr>
    <td align="center"><strong>🔊</strong></td>
    <td><strong>Intelligent Interruption</strong><br/>Users interrupt AI naturally</td>
  </tr>
  <tr>
    <td align="center"><strong>🔇</strong></td>
    <td><strong>Noise Suppression</strong><br/>Built-in background noise reduction</td>
  </tr>
</table>

### 🧠 App-Less Agent Workflow

<table>
  <tr>
    <td align="center"><strong>🎯</strong></td>
    <td><strong>Intent Understanding</strong><br/>LLM interprets user goals, not just keywords</td>
  </tr>
  <tr>
    <td align="center"><strong>📋</strong></td>
    <td><strong>Workflow Planning</strong><br/>Agent plans multi-step execution</td>
  </tr>
  <tr>
    <td align="center"><strong>🔌</strong></td>
    <td><strong>Tool Calling (MCP)</strong><br/>External API integration — flights, calendar, weather</td>
  </tr>
  <tr>
    <td align="center"><strong>🎨</strong></td>
    <td><strong>Dynamic UI Generation</strong><br/>AI creates interfaces on the fly</td>
  </tr>
  <tr>
    <td align="center"><strong>❓</strong></td>
    <td><strong>Contextual Clarification</strong><br/>Asks follow-up questions to resolve ambiguity</td>
  </tr>
  <tr>
    <td align="center"><strong>🔗</strong></td>
    <td><strong>Autonomous Chaining</strong><br/>Executes multiple actions from a single prompt</td>
  </tr>
</table>

---

## 🛠️ Tech Stack

<div align="center">
  <table>
    <thead>
      <tr>
        <th>Component</th>
        <th>Technology</th>
        <th>Purpose</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>📱 Mobile Framework</strong></td>
        <td>React Native</td>
        <td>Cross-platform mobile app</td>
      </tr>
      <tr>
        <td><strong>🎙️ Voice SDK</strong></td>
        <td>react-native-agora</td>
        <td>Real-time audio streaming</td>
      </tr>
      <tr>
        <td><strong>🧠 AI Engine</strong></td>
        <td>Agora Conversational AI v2.9</td>
        <td>Agent orchestration</td>
      </tr>
      <tr>
        <td><strong>🗣️ ASR</strong></td>
        <td>Deepgram (via Managed Mode)</td>
        <td>Speech-to-text</td>
      </tr>
      <tr>
        <td><strong>💭 LLM</strong></td>
        <td>OpenAI GPT-4o (via Managed Mode)</td>
        <td>Intent understanding, reasoning</td>
      </tr>
      <tr>
        <td><strong>🔊 TTS</strong></td>
        <td>OpenAI TTS (via Managed Mode)</td>
        <td>Text-to-speech</td>
      </tr>
      <tr>
        <td><strong>📡 Signaling</strong></td>
        <td>Agora RTM</td>
        <td>Manual turn control, state events</td>
      </tr>
      <tr>
        <td><strong>🔌 Tool Calling</strong></td>
        <td>MCP Server</td>
        <td>External API integration</td>
      </tr>
    </tbody>
  </table>
</div>

---

## 🆓 Free Resources

<table>
  <tr>
    <th>Resource</th>
    <th>Free Tier</th>
    <th>Notes</th>
  </tr>
  <tr>
    <td>Agora RTC</td>
    <td>10,000 minutes/month</td>
    <td>Core audio streaming for users</td>
  </tr>
  <tr>
    <td>Agora Conversational AI Engine</td>
    <td>300 minutes (one-time trial)</td>
    <td>ASR + LLM + TTS included</td>
  </tr>
  <tr>
    <td>Deepgram ASR</td>
    <td>✅ Included in AI Engine</td>
    <td>Via Managed Mode</td>
  </tr>
  <tr>
    <td>OpenAI GPT</td>
    <td>✅ Included in AI Engine</td>
    <td>Via Managed Mode</td>
  </tr>
  <tr>
    <td>OpenAI TTS</td>
    <td>✅ Included in AI Engine</td>
    <td>Via Managed Mode</td>
  </tr>
</table>

> ⚠️ **CRITICAL:** The 300 AI Engine minutes are **ONE-TIME ONLY**. Use them wisely for final testing and demo recording.

---

## 📁 Project Structure

```
intentio/
├── 📄 package.json
├── 📄 README.md
├── 📄 AGENTS.md
├── 📄 PRD.md
│
├── 📁 android/                    # Android native code
├── 📁 ios/                        # iOS native code
│
├── 📁 src/                        # Main TypeScript code
│   ├── 📁 components/             # Reusable UI components
│   │   ├── AgentVisualizer.tsx    # Shows agent states
│   │   ├── MicButton.tsx          # Push-to-talk button
│   │   ├── TranscriptDisplay.tsx  # Conversation history
│   │   └── StateIndicator.tsx     # Agent status UI
│   │
│   ├── 📁 screens/                # Full-screen views
│   │   ├── HomeScreen.tsx
│   │   ├── ChatScreen.tsx
│   │   └── SettingsScreen.tsx
│   │
│   ├── 📁 hooks/                  # Custom React Hooks
│   │   ├── useAgoraEngine.ts      # RTC engine initialization
│   │   ├── useAgentState.ts       # RTM state subscriptions
│   │   └── usePermissions.ts      # Microphone + audio permissions
│   │
│   ├── 📁 services/               # Backend API calls
│   │   ├── tokenService.ts        # Fetches RTC+RTM token
│   │   ├── agentService.ts        # Start/stop agent
│   │   └── apiClient.ts           # API configuration
│   │
│   ├── 📁 utils/                  # Utility functions
│   │   ├── permissions.ts         # Permission handling
│   │   ├── logger.ts              # Debug logging
│   │   └── constants.ts           # App constants
│   │
│   ├── 📁 types/                  # TypeScript definitions
│   │   ├── agent.ts               # Agent state types
│   │   ├── rtc.ts                 # RTC event types
│   │   └── api.ts                 # API request/response types
│   │
│   ├── App.tsx                    # Main app entry
│   └── index.ts                   # Register app
│
├── 📁 backend/                    # Business server
│   ├── server.js                  # Main server entry
│   ├── 📁 routes/
│   │   ├── token.js               # POST /api/token
│   │   ├── agent.js               # POST /api/start-agent
│   │   └── mcp.js                 # MCP server routes
│   ├── 📁 controllers/
│   └── 📁 mcp/                    # MCP Server
│       ├── tools/
│       │   ├── flightBooking.js
│       │   ├── calendar.js
│       │   └── weather.js
│       └── mcpConfig.json
│
└── 📁 assets/                     # Static assets
    └── 📁 audio/
        └── greeting.mp3           # Pre-recorded greeting
```

---

## 🚀 Getting Started

### Prerequisites

<div align="left">
  <table>
    <tr>
      <td align="center"><strong>📦</strong></td>
      <td><strong>Node.js</strong> (v16 or higher)</td>
    </tr>
    <tr>
      <td align="center"><strong>🍺</strong></td>
      <td><strong>Homebrew</strong> (for macOS)</td>
    </tr>
    <tr>
      <td align="center"><strong>📱</strong></td>
      <td><strong>Xcode</strong> (for iOS development)</td>
    </tr>
    <tr>
      <td align="center"><strong>🤖</strong></td>
      <td><strong>Android Studio</strong> (for Android development)</td>
    </tr>
    <tr>
      <td align="center"><strong>📦</strong></td>
      <td><strong>Watchman</strong> (for file watching)</td>
    </tr>
  </table>
</div>

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/intentio.git
cd intentio
```

2. **Install dependencies**
```bash
# Frontend
yarn install
# or
npm install

# Backend
cd backend
yarn install
# or
npm install
```

3. **Configure environment variables**

Create a `.env` file in the root directory:

```env
# Agora Configuration
AGORA_APP_ID=your_app_id
AGORA_APP_CERTIFICATE=your_app_certificate

# Backend Configuration
PORT=3000

# MCP Server Configuration
MCP_SERVER_PORT=3001
```

4. **Install iOS dependencies**
```bash
cd ios
pod install
cd ..
```

### Running the App

#### 📱 Run on iOS

```bash
# Start Metro bundler
yarn start

# Run on iOS simulator
yarn ios

# Run on physical device
yarn ios --device "Your iPhone"
```

#### 🤖 Run on Android

```bash
# Start Metro bundler
yarn start

# Run on Android emulator
yarn android

# Run on physical device
yarn android --device
```

#### 🖥️ Run Backend Server

```bash
cd backend
yarn dev
# or
npm run dev
```

---

## 🎯 Demo Script

Follow this script to record your winning demo:

<table>
  <thead>
    <tr>
      <th>Step</th>
      <th>Action</th>
      <th>What Viewer Sees</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td>Launch app</td>
      <td>Clean, minimal UI</td>
    </tr>
    <tr>
      <td>2</td>
      <td>Agent starts</td>
      <td>Pre-recorded professional greeting</td>
    </tr>
    <tr>
      <td>3</td>
      <td>Agent state updates</td>
      <td>Listening → Thinking → Speaking UI</td>
    </tr>
    <tr>
      <td>4</td>
      <td>User speaks: "Book a flight to London next Tuesday"</td>
      <td>Transcript appears</td>
    </tr>
    <tr>
      <td>5</td>
      <td>AI responds with confirmation</td>
      <td>Natural conversation</td>
    </tr>
    <tr>
      <td>6</td>
      <td>Tool calling visible</td>
      <td>Flight API query</td>
    </tr>
    <tr>
      <td>7</td>
      <td>Dynamic UI generation</td>
      <td>Flight options shown</td>
    </tr>
    <tr>
      <td>8</td>
      <td>Complete booking via voice</td>
      <td>Voice confirmation</td>
    </tr>
    <tr>
      <td>9</td>
      <td><strong>Interruption test</strong></td>
      <td>Interrupt AI mid-sentence — works naturally</td>
    </tr>
  </tbody>
</table>

---

## 📦 Deployment

### Deploy Backend to Production

```bash
# Deploy to Vercel
vercel --prod

# Deploy to Render
# Use the render.yaml or manual deploy

# Deploy to Heroku
heroku create intentio-backend
git push heroku main
```

### Build Mobile App

```bash
# Build for iOS (Release)
yarn build:ios

# Build for Android (Release)
yarn build:android
```

---

## 🤝 Contributing

We welcome contributions! Here's how:

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- **Agora** for providing the Conversational AI Engine v2.9
- **Deepgram** for speech-to-text capabilities
- **OpenAI** for GPT and TTS models
- **React Native** community for cross-platform excellence

---

## 📞 Contact

<div align="center">
  <table>
    <tr>
      <td align="center">
        <a href="https://github.com/yourusername">
          <img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub"/>
        </a>
      </td>
      <td align="center">
        <a href="https://twitter.com/yourusername">
          <img src="https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white" alt="Twitter"/>
        </a>
      </td>
      <td align="center">
        <a href="mailto:intentio@example.com">
          <img src="https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white" alt="Email"/>
        </a>
      </td>
    </tr>
  </table>
</div>

---

<div align="center">
  <p>
    <strong>Intentio</strong> — <em>Speak your intent. We act.</em>
  </p>
  <p>
    Built with ❤️ for the EchoSphere: Agora Conversational AI Hackathon
  </p>
</div>