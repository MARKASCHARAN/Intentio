# Intentio Project Rules

## Project Identity
- Name: Intentio
- Tagline: "Speak your intent. We act."
- Built for: EchoSphere: Agora Conversational AI Hackathon

## Tech Stack
- Frontend: React Native + TypeScript
- Voice SDK: react-native-agora
- AI Engine: Agora Conversational AI v2.9
- ASR: Deepgram (Managed Mode)
- LLM: OpenAI GPT-4o (Managed Mode)
- TTS: OpenAI TTS (Managed Mode)
- Backend: Node.js + Express
- Tool Calling: MCP Server

## Critical Rules
1. ALWAYS use Managed Mode - no API keys needed
2. 300 AI Engine minutes are ONE-TIME - use only for final demo
3. 10,000 RTC minutes refresh monthly - safe for testing
4. Enable RTM for state notifications
5. Implement all v2.9 features

## Coding Standards
- TypeScript: Strict mode, proper types
- React Native: Functional components with hooks
- Backend: Async/await, proper error handling
- Documentation: Comments for complex logic

## Platform Support
- Primary testing: Android (I have an Android phone)
- iOS: Code is cross-platform compatible but Android testing is sufficient

## Submission Requirements
- GitHub repository (public)
- Demo video (under 5 minutes)
- README.md, AGENTS.md, PRD.md, ProjectGuide.md
- Working prototype
