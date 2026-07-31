/**
 * Agora REST API request/response types for the Intentio backend.
 */

/** Request body sent to POST /api/token */
export interface TokenRequest {
  channelName: string;
  uid: number;
  role?: 'publisher' | 'subscriber';
}

/** Response from POST /api/token */
export interface TokenResponse {
  token: string;
  rtmToken: string;
  appId: string;
  channelName: string;
  uid: number;
  expiresIn: number;
}

/** Request body sent to POST /api/agent/start */
export interface AgentStartRequest {
  channelName: string;
  userUid: string;
  token: string;
}

/** Response from POST /api/agent/start */
export interface AgentStartResponse {
  success: boolean;
  agentId: string;
  agentUid: string;
  message?: string;
}

/** Response from POST /api/agent/stop */
export interface AgentStopResponse {
  success: boolean;
  message?: string;
}

/** Response from GET /api/agent/status */
export interface AgentStatusResponse {
  status: 'running' | 'stopped' | 'error';
  agentId?: string;
  uptime?: number;
}

/** Generic API error response */
export interface ApiErrorResponse {
  success: false;
  error: {
    message: string;
    stack?: string;
  };
}
