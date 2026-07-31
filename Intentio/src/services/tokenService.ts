/**
 * Token service — fetches RTC and RTM tokens from the backend.
 * Tokens carry both RTC and RTM privileges since RTM is enabled (Agora v2.9).
 */
import apiClient from './apiClient';
import type {TokenRequest, TokenResponse} from '../types/api';
import logger from '../utils/logger';

const TAG = 'TokenService';

/**
 * Fetches an Agora RTC + RTM token from the backend.
 *
 * @param channelName - The Agora channel to join
 * @param uid - The local user UID (use 0 for server-assigned)
 * @returns TokenResponse containing token, rtmToken, and metadata
 */
export async function fetchToken(
  channelName: string,
  uid: number = 0,
): Promise<TokenResponse> {
  logger.info(TAG, `Fetching token for channel: ${channelName}, uid: ${uid}`);

  const body: TokenRequest = {
    channelName,
    uid,
    role: 'publisher',
  };

  const response = await apiClient.post<TokenResponse>('/api/token', body);
  logger.info(TAG, 'Token fetched successfully, expires in:', response.data.expiresIn);
  return response.data;
}
