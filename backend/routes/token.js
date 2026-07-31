'use strict';

const express = require('express');
const {RtcTokenBuilder, RtmTokenBuilder, RtcRole} = require('agora-token');
const router = express.Router();

/**
 * POST /api/token
 *
 * Generates Agora RTC + RTM tokens server-side.
 * NEVER generate tokens on the client — the App Certificate must stay secret.
 *
 * Request body:
 * {
 *   channelName: string,
 *   uid: number,
 *   role?: "publisher" | "subscriber"  (default: "publisher")
 * }
 *
 * Response:
 * {
 *   token: string,          // RTC token
 *   rtmToken: string,       // RTM token (required for v2.9 state notifications)
 *   appId: string,
 *   channelName: string,
 *   uid: number,
 *   expiresIn: number
 * }
 */
router.post('/', (req, res, next) => {
  try {
    const {channelName, uid = 0, role = 'publisher'} = req.body;

    if (!channelName) {
      return res.status(400).json({
        success: false,
        error: {message: 'channelName is required'},
      });
    }

    const appId = process.env.AGORA_APP_ID;
    const appCertificate = process.env.AGORA_APP_CERTIFICATE;

    if (!appId || !appCertificate) {
      return res.status(500).json({
        success: false,
        error: {message: 'Agora credentials not configured. Check .env file.'},
      });
    }

    const expirySeconds = parseInt(
      process.env.TOKEN_EXPIRY_SECONDS || '3600',
      10,
    );
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expirySeconds;

    const rtcRole =
      role === 'publisher' ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;

    // Generate RTC token
    const rtcToken = RtcTokenBuilder.buildTokenWithUid(
      appId,
      appCertificate,
      channelName,
      uid,
      rtcRole,
      privilegeExpiredTs,
      privilegeExpiredTs,
    );

    // Generate RTM token (required for Agora v2.9 state notifications + manual turn control)
    const rtmToken = RtmTokenBuilder.buildToken(
      appId,
      appCertificate,
      String(uid),
      privilegeExpiredTs,
    );

    console.log(`[TokenController] Generated tokens for channel=${channelName}, uid=${uid}`);

    return res.json({
      token: rtcToken,
      rtmToken,
      appId,
      channelName,
      uid,
      expiresIn: expirySeconds,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
