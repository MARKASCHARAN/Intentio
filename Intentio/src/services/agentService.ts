/**
 * Agent service — manages Intentio agent lifecycle via the backend API.
 * The backend in turn calls the Agora Conversational AI Engine v2.9 REST API.
 */
import apiClient from './apiClient';
import type {
  AgentStartRequest,
  AgentStartResponse,
  AgentStopResponse,
  AgentStatusResponse,
} from '../types/api';
import logger from '../utils/logger';

const TAG = 'AgentService';

/** In-memory store for the active agent session ID */
let activeAgentId: string | null = null;

/**
 * Starts the Intentio AI agent in the specified channel.
 * Configures Managed Mode ASR + LLM + TTS, RTM, and MCP tools.
 *
 * @param channelName - The Agora channel for the agent to join
 * @param userUid - The user's RTC UID (so agent knows who to talk to)
 * @param token - The RTC+RTM token with both privileges
 */
export async function startAgent(
  channelName: string,
  userUid: string,
  token: string,
): Promise<AgentStartResponse> {
  logger.info(TAG, `Starting agent in channel: ${channelName}`);

  const body: AgentStartRequest = {channelName, userUid, token};
  const response = await apiClient.post<AgentStartResponse>(
    '/api/agent/start',
    body,
  );

  activeAgentId = response.data.agentId;
  logger.info(TAG, 'Agent started, ID:', activeAgentId);
  return response.data;
}

/**
 * Stops the active Intentio agent and removes it from the channel.
 */
export async function stopAgent(): Promise<AgentStopResponse> {
  if (!activeAgentId) {
    logger.warn(TAG, 'stopAgent called but no active agent ID');
    return {success: true, message: 'No active agent to stop'};
  }

  logger.info(TAG, `Stopping agent: ${activeAgentId}`);
  const response = await apiClient.post<AgentStopResponse>(
    '/api/agent/stop',
    {agentId: activeAgentId},
  );

  activeAgentId = null;
  logger.info(TAG, 'Agent stopped successfully');
  return response.data;
}

/**
 * Queries the current status of the active agent.
 */
export async function getAgentStatus(): Promise<AgentStatusResponse> {
  const response = await apiClient.get<AgentStatusResponse>(
    '/api/agent/status',
    {params: {agentId: activeAgentId}},
  );
  return response.data;
}

/** Returns the current active agent session ID (or null if none) */
export function getActiveAgentId(): string | null {
  return activeAgentId;
}
