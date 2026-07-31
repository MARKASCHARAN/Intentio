/**
 * Agora App ID — from Agora Console (safe to put here, but never the certificate)
 * Replace with your actual App ID before running.
 *
 * ⚠️ Android emulator uses 10.0.2.2 to reach host localhost.
 * ⚠️ Physical Android device needs your machine's LAN IP (e.g., 192.168.x.x)
 */
export const AGORA_APP_ID: string = '905919ec6a3c46229f0f37245d607e59';

/** RTC channel name shared between client and agent */
export const CHANNEL_NAME: string = 'intentio-demo-channel';

import {Platform} from 'react-native';

/**
 * Backend API base URL.
 * Web: http://localhost:3000
 * Android emulator: http://10.0.2.2:3000
 */
export const API_BASE_URL: string =
  Platform.OS === 'web'
    ? 'http://localhost:3000'
    : 'http://10.0.2.2:3000';

/** Pre-recorded greeting audio URL (Agora v2.9 feature) */
export const GREETING_AUDIO_URL: string =
  'https://intentio-assets.s3.amazonaws.com/greeting.mp3';

/** How long a token is valid for (must match backend TOKEN_EXPIRY_SECONDS) */
export const TOKEN_EXPIRY_SECONDS: number = 3600;

/** Agent idle timeout configured on the backend */
export const AGENT_IDLE_TIMEOUT: number = 30;

/** App version */
export const APP_VERSION: string = '1.0.0';
