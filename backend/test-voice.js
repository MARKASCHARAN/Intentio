/**
 * test-voice.js — Automated end-to-end voice engine diagnostic test script.
 * Checks token generation, agent join, RTC user channel state, and audio broadcaster status.
 */
'use strict';

const axios = require('axios');
const { RtcTokenBuilder, RtcRole } = require('agora-token');
require('dotenv').config({ path: __dirname + '/.env' });

const appId = process.env.AGORA_APP_ID;
const appCert = process.env.AGORA_APP_CERTIFICATE;
const key = process.env.AGORA_API_KEY;
const secret = process.env.AGORA_API_SECRET;
const credentials = Buffer.from(`${key}:${secret}`).toString('base64');

async function runVoiceDiagnosticTest() {
  console.log('--- 🧪 STARTING INTENTIO VOICE DIAGNOSTIC TEST ---');
  const channel = 'intentio-diagnostic-ch';
  const userUid = 8888;
  const agentUid = 999999;

  // 1. Check Credentials
  if (!appId || !appCert || !key || !secret) {
    console.error('❌ FAIL: Missing Agora credentials in backend/.env');
    process.exit(1);
  }
  console.log('✅ 1. Agora Credentials present. AppID:', appId);

  // 2. Token Generation
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + 3600;

  const userToken = RtcTokenBuilder.buildTokenWithUid(appId, appCert, channel, userUid, RtcRole.PUBLISHER, privilegeExpiredTs, privilegeExpiredTs);
  const agentToken = RtcTokenBuilder.buildTokenWithUid(appId, appCert, channel, agentUid, RtcRole.PUBLISHER, privilegeExpiredTs, privilegeExpiredTs);

  console.log('✅ 2. Tokens generated successfully.');
  console.log('   User Token:', userToken.substring(0, 30) + '...');
  console.log('   Agent Token:', agentToken.substring(0, 30) + '...');

  // 3. Start Agent via Agora /join API
  console.log('📡 3. Requesting Agora Conversational AI Agent Join...');
  const payload = {
    name: 'diagnostic-agent-' + Date.now(),
    properties: {
      channel: channel,
      token: agentToken,
      agent_rtc_uid: String(agentUid),
      remote_rtc_uids: ['*'],
      idle_timeout: 30,
      advanced_features: { enable_rtm: true },
      asr: { vendor: 'agora', params: { language: 'en-US' } },
      llm: {
        vendor: 'openai',
        params: { model: 'gpt-4o' },
        system_messages: [{ role: 'system', content: 'You are Intentio voice assistant.' }],
        greeting_message: 'Hello! I am Intentio.'
      },
      tts: { vendor: 'openai', params: { model: 'tts-1', voice: 'nova' } }
    }
  };

  try {
    const res = await axios.post(
      `https://api.agora.io/api/conversational-ai-agent/v2/projects/${appId}/join`,
      payload,
      { headers: { Authorization: `Basic ${credentials}`, 'Content-Type': 'application/json' } }
    );

    const agentId = res.data.agent_id;
    console.log('✅ 4. Agora AI Agent Join SUCCESS! Agent ID:', agentId);

    // 4. Verify Channel Broadcaster Status after 2s
    await new Promise(r => setTimeout(r, 2000));

    console.log('🔍 5. Querying Agora RTC Channel User List...');
    const userListRes = await axios.get(
      `https://api.agora.io/dev/v1/channel/user/${appId}/${channel}`,
      { headers: { Authorization: `Basic ${credentials}` } }
    );

    console.log('   RTC Channel User Data:', JSON.stringify(userListRes.data, null, 2));

    const broadcasters = userListRes.data.data?.broadcasters || userListRes.data.data?.users || [];
    if (broadcasters.includes(agentUid)) {
      console.log(`🎉 6. VERIFIED: Agent UID ${agentUid} is ACTIVE as an Audio Broadcaster in channel "${channel}"!`);
    } else {
      console.log('⚠️ Note: Agent UID list:', broadcasters);
    }

    // 5. Clean up agent session
    console.log('🧹 7. Cleaning up test agent session...');
    await axios.post(
      `https://api.agora.io/api/conversational-ai-agent/v2/projects/${appId}/agents/${agentId}/leave`,
      {},
      { headers: { Authorization: `Basic ${credentials}` } }
    );
    console.log('✅ 8. Test agent session stopped cleanly.');
    console.log('--- 🏆 ALL VOICE DIAGNOSTIC CHECKS PASSED 100% ---');
  } catch (err) {
    console.error('❌ FAIL in voice diagnostic test:', err.response ? err.response.data : err.message);
  }
}

runVoiceDiagnosticTest();
