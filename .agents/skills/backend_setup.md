# Skill: Backend Server Setup

## Objective
Setup the Node.js/Express backend with token generation and agent endpoints.

## Rules of Engagement
- Use `backend/` as root directory
- Install: express, cors, dotenv, axios, agora-token
- Create `.env` file with Agora credentials placeholders

## Instructions
1. Initialize backend: `cd backend && npm init -y`
2. Install all dependencies
3. Create `server.js` with Express server
4. Create `routes/token.js` for RTC+RTM token generation
5. Create `routes/agent.js` for start/stop agent endpoints
6. Configure Managed Mode for free ASR+LLM+TTS
7. Test endpoints with a sample request
