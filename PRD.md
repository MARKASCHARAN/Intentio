# 📱 Intentio: Full Product Requirements Document (PRD)

## Project Overview

**Project Name:** Intentio *(Latin for "intention" or "purpose")*

**Tagline:** *"Speak your intent. We act."*

**Built for:** EchoSphere: Agora Conversational AI Hackathon

**Tech Stack:** React Native + Agora Conversational AI Engine v2.9

---

## 1. Executive Summary

### The Core Problem

Traditional mobile interaction forces users to navigate through multiple apps, menus, and screens to accomplish even simple tasks. Voice assistants like Siri, Alexa, and Google Assistant are stuck in a **command-response paradigm**—they recognize keywords but cannot execute complex, multi-step workflows autonomously.

### The Solution

**Intentio** is a voice-first mobile "agent layer" that replaces app-based navigation with conversational intent understanding. Users speak their goals naturally—and Intentio's AI agent reasons, plans, and executes autonomously.

### Why Now? Strategic Alignment

| Question | Answer |
|---|---|
| **Why is this problem worth solving?** | App friction costs users time and mental energy. Studies show users switch between apps 300+ times daily. The average mobile user has 80+ apps installed but only uses 9 daily. |
| **Why is our team uniquely suited?** | We leverage Agora's brand-new v2.9 features (released July 2026) that no competitor has—manual turn control, agent state notifications over RTM, and managed mode for free AI services. |
| **What existing solutions fail?** | Siri/Alexa/Google Assistant can't handle complex workflows, can't call external APIs, use slow WebSocket architecture, and lack natural interruption handling. |

---

## 2. Target Users

| User Type | Pain Point | How Intentio Helps |
|---|---|---|
| **Busy Professionals** | Wasting time navigating calendars, email, travel apps | "Schedule a meeting with the team next Tuesday" → Done |
| **Accessibility Users** | Difficulty with small touch targets and menus | Full voice control for all mobile tasks |
| **Travelers** | Coordinating flights, hotels, rides across apps | "Get me to London next Tuesday and book a hotel" → Done |
| **AI Enthusiasts/Devs** | Want cutting-edge voice agent experiences | Demonstrates production-ready voice AI |

---

## 3. Why This Wins: Differentiation

### Comparison: Intentio vs. Existing Solutions

| Capability | Siri/Alexa/Google | Traditional Voicebot | **Intentio** |
|---|---|---|---|
| **Conversation style** | Command-response | Scripted flows | **Natural, goal-oriented** |
| **Real-time interruptions** | ❌ | ❌ | ✅ **Natural interruption handling** |
| **Response generation** | Pre-written | Pre-written | **AI-generated, contextual** |
| **Complex multi-step tasks** | ❌ | ❌ | ✅ **Autonomous chaining** |
| **Enterprise integrations** | Limited (first-party) | Limited | **Any API via MCP** |
| **Cross-platform execution** | ❌ (ecosystem locked) | ❌ | ✅ **Any system** |
| **Architecture** | WebSocket | Decision trees | **UDP + LLM reasoning** |
| **Latency** | High | High | **Sub-650ms** |

### The Fundamental Distinction

> Siri, Alexa, and Google Assistant are **voice remote controls**. Intentio is an **autonomous digital agent**.

**Intentio differs because:**
1. **Intent-based, not command-based** → Understands your goal, not just your words
2. **Autonomous execution** → Doesn't wait for each step; plans and executes workflows
3. **Goal-oriented reasoning** → Uses LLM to determine what you actually want
4. **Tool calling via MCP** → Can call flight APIs, calendars, weather—any external service
5. **UDP transport** → Agora's SDRTN delivers sub-650ms response, 80% packet loss resilience

---

## 4. Technical Differentiation: Agora v2.9 Features (July 2026)

Intentio leverages **brand new Agora features** that no existing competitor has. This is a critical differentiator for the hackathon.

### Feature 1: Manual Turn Control 

> *"You can now explicitly control when a user's speech starts and ends by sending manual Start of Speech (SoS) and End of Speech (EoS) requests over Signaling (RTM), instead of relying on automatic detection."* 

**Why it matters:** Perfect for structured workflows like booking flights, interactive quizzes, or push-to-talk scenarios. Eliminates false interruptions in sensitive conversations.

### Feature 2: Agent State Notifications over RTM 

> *"The agent pushes `state.listening`, `state.thinking`, and `state.speaking` events as individual RTM messages."* 

**Why it matters:** Drives real-time UI state. Users see "Listening...", "Thinking...", "Speaking..."—making the agent feel responsive and human-like.

### Feature 3: Pre-recorded Greeting Audio 

> *"You can now play a pre-recorded audio file as the agent's greeting instead of synthesizing it with TTS."* 

**Why it matters:** Professional, polished experience. Reduces TTS costs on the 300-minute trial. Auto-falls back to TTS if audio fails.

### Feature 4: Managed Mode 

> *"You can now use supported ASR, LLM, and TTS providers with Agora-managed credentials, without supplying your own API keys."* 

**Why it matters:** Completely free to build. No separate OpenAI or Deepgram billing needed. Deepgram ASR + OpenAI GPT + OpenAI TTS all included.

---

## 5. Product Features

### Core Agent Features (Powered by Agora v2.9)

| Feature | Description | Why It Wins |
|---|---|---|
| **Ultra-low latency voice** | 650ms response time from end of speech | Natural, human-like conversation |
| **UDP-based transport** | Agora SDRTN with 250+ data centers | 80% packet loss resilience |
| **Manual Turn Control** | Explicit SoS/EoS over RTM | Structured workflows, push-to-talk |
| **Agent State Notifications** | Real-time RTM events | Drives UI state, observability |
| **Pre-recorded Greeting** | URL-based audio, TTS fallback | Polished, cost-effective |
| **Managed Mode** | No API keys needed | Completely free to build |
| **Intelligent interruption** | Users interrupt AI naturally | Natural conversation flow |
| **Noise suppression** | Built-in background noise reduction | Works in any environment |
| **Voice Activity Detection (VAD)** | Automatic turn detection | Seamless interaction |

### App-Less Agent Workflow Features

| Feature | Description |
|---|---|
| **Intent Understanding** | LLM interprets user goals, not just keywords |
| **Workflow Planning** | Agent plans multi-step execution |
| **Tool Calling (MCP)** | External API integration—flights, calendars, weather |
| **Dynamic UI Generation** | AI creates interfaces on the fly |
| **Contextual Clarification** | Asks follow-up questions to resolve ambiguity |
| **Autonomous Chaining** | Executes multiple actions from a single prompt |

### Mobile App Features (React Native)

| Feature | Description |
|---|---|
| **Cross-platform** | iOS and Android via react-native-agora  |
| **Real-time audio streaming** | Agora RTC SDK integration |
| **Permission handling** | Microphone + audio permissions  |
| **State UI** | Shows "Listening/Thinking/Speaking" states |
| **Transcript display** | Conversation history visible |
| **Push-to-talk mode** | Manual turn control for structured workflows |

---

## 6. Technical Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                  React Native Mobile App                    │
│  ┌──────────────┐  ┌────────────────────────────────────┐  │
│  │  Voice UI    │  │  Agora RTC SDK (Audio Streaming)   │  │
│  │  (State UI)  │  │  Agora Signaling (RTM Events)      │  │
│  └──────────────┘  └────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │   Agora SDRTN®      │
                    │  (UDP Transport)    │
                    └─────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│               Agora Conversational AI Engine v2.9           │
│  ┌────────────┐  ┌──────────────┐  ┌────────────────────┐ │
│  │ ASR (STT)  │→│ LLM (Brain)  │→│ TTS (Speech)       │ │
│  │(Managed)   │  │  (Managed)   │  │  (Managed)         │ │
│  └────────────┘  └──────────────┘  └────────────────────┘ │
│                    │                                        │
│                    ▼                                        │
│          ┌─────────────────────┐                           │
│          │  MCP Server         │                           │
│          │ (Tool Calling)     │                           │
│          └─────────────────────┘                           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    External APIs (Flights, Calendar, Weather)
```

### Tech Stack

| Component | Technology | Purpose |
|---|---|---|
| **Mobile Framework** | React Native 0.60+  | Cross-platform mobile app |
| **Voice SDK** | react-native-agora  | Real-time audio streaming |
| **AI Engine** | Agora Conversational AI v2.9  | Agent orchestration |
| **ASR** | Deepgram (via Managed Mode)  | Speech-to-text |
| **LLM** | OpenAI GPT (via Managed Mode)  | Intent understanding, reasoning |
| **TTS** | OpenAI TTS (via Managed Mode)  | Text-to-speech |
| **Signaling** | Agora RTM | Manual turn control, state events |

---

## 7. Free Resources

| Resource | Free Tier | Notes |
|---|---|---|
| **Agora RTC** | 10,000 minutes/month | Core audio streaming for users |
| **Agora Conversational AI Engine** | 300 minutes (one-time trial) | ASR + LLM + TTS included |
| **Deepgram ASR** | Included in AI Engine | Via Managed Mode  |
| **OpenAI GPT** | Included in AI Engine | Via Managed Mode  |
| **OpenAI TTS** | Included in AI Engine | Via Managed Mode  |

> ⚠️ **CRITICAL:** The 300 AI Engine minutes are **ONE-TIME ONLY**. Use them wisely for final testing and demo recording.

---

## 8. Hackathon Evaluation Strategy

Based on standard hackathon judging criteria , Intentio is positioned to score high in every category:

### Category 1: Innovation & Ambition (50% weight) 

| Criterion | How Intentio Scores |
|---|---|
| **Creates new category?** | ✅ Voice agent, not voice assistant—paradigm shift |
| **Meaningfully innovates beyond existing?** | ✅ Agora v2.9 features—manual turn control, state notifications—are brand new (July 2026)  |
| **New or improved approach?** | ✅ Intent-based vs. command-based reasoning |
| **Innovation in UX?** | ✅ Real-time agent state UI, natural interruption handling |
| **Innovation in tech design?** | ✅ UDP vs. WebSocket, manual turn control, MCP integration |

### Category 2: Quality of Implementation 

| Criterion | How Intentio Scores |
|---|---|
| **Ease of use?** | ✅ Voice-first, no app navigation required |
| **Professional polish?** | ✅ Pre-recorded greeting, state UI, polished interaction |
| **Performs well?** | ✅ Sub-650ms latency, 80% packet loss resilience  |
| **Platform feature utilization?** | ✅ Full use of Agora v2.9 features—manual turn, RTM states, managed mode |

### Category 3: Feasibility & Impact 

| Criterion | How Intentio Scores |
|---|---|
| **Clear target audience?** | ✅ Professionals, accessibility users, travelers |
| **Solves real problem?** | ✅ App friction, complex multi-step tasks |
| **Potential for adoption?** | ✅ High—voice agent market is growing rapidly |
| **Potential for long-term value?** | ✅ Can be extended to any API workflow |

### Category 4: Presentation 

| Criterion | How Intentio Scores |
|---|---|
| **Clear functionality?** | ✅ Demo flow shows voice → intent → execution |
| **Visualization clear?** | ✅ State UI shows agent progress |

---

## 9. Competition Differentiation Summary

### Why NOT Siri, Alexa, Google Assistant?

| Siri/Alexa/Google | Intentio |
|---|---|
| **Reactive** — wait for commands | **Proactive** — can act autonomously |
| **Command-response** patterns | **Goal-oriented** reasoning |
| **Single-step** tasks only | **Complex, multi-step** workflows |
| **Limited to first-party** apps | **Any API** via MCP server |
| **WebSocket** architecture (high latency) | **UDP SDRTN** (sub-650ms latency) |
| **Cannot handle interruptions** well | **Natural interruption handling**  |
| **Ecosystem locked** | **Cross-platform** |
| **Requires user to adapt** | **Adapts to user** |

### Why NOT Traditional Voicebots?

| Traditional Voicebots | Intentio |
|---|---|
| **Scripted conversation flows** | **AI-generated, contextual** responses |
| **Predefined decision trees** | **Dynamic path planning** |
| **Cannot handle interruptions** | **Natural interruption handling** |
| **Multi-language builds** | **Native multilingual** |

---

## 10. Submission Checklist

- [ ] Project name: **Intentio**
- [ ] Tagline: **"Speak your intent. We act."**
- [ ] Selected track: **Open Innovation**
- [ ] Team member details
- [ ] GitHub repository with complete source code
- [ ] **Demo video** (record within 300 free minutes)
- [ ] Architecture/technology stack diagram
- [ ] **Agora v2.9 integration explanation**—highlight manual turn control, RTM state notifications, managed mode
- [ ] Working demo link/deployment

---

## 11. Demo Script (Record Within 300 Free Minutes)

| Step | Action | What Viewer Sees |
|---|---|---|
| 1 | Launch app | Clean, minimal UI |
| 2 | Agent starts | Pre-recorded professional greeting |
| 3 | Agent state updates | Listening → Thinking → Speaking UI |
| 4 | User speaks: "Book a flight to London next Tuesday" | Transcript appears |
| 5 | AI responds with confirmation and clarification | Natural conversation |
| 6 | Tool calling visible | Flight API query |
| 7 | Dynamic UI generation | Flight options shown |
| 8 | Complete booking via voice | Voice confirmation |
| 9 | **Interruption test** | Interrupt AI mid-sentence—works naturally |

---

## 12. Final Summary

**Intentio** wins because it:

1. **Is a paradigm shift**—agent, not assistant 
2. **Uses the latest Agora v2.9 technology** (July 2026) that no competitor has 
3. **Solves a real problem**—app friction and complex workflow execution
4. **Shows technical excellence**—UDP transport, sub-650ms latency, 80% packet loss resilience 
5. **Is completely free to build**—Managed Mode provides ASR + LLM + TTS without API keys 
6. **Has clear market potential**—voice agent market is growing rapidly
7. **Is professionally polished**—pre-recorded greeting, state UI, natural interaction

> *"Intentio – Speak your intent. We act."*
