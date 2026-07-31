/**
 * Agent state types — driven by Agora v2.9 RTM state notifications.
 */

/** The four states an Intentio agent can be in */
export type AgentStateType = 'idle' | 'listening' | 'thinking' | 'speaking';

/** RTM message payload sent by Agora for state transitions */
export interface AgentStateMessage {
  type:
    | 'state.listening'
    | 'state.thinking'
    | 'state.speaking'
    | 'state.idle';
  timestamp: number;
  agentUid: string;
}

/** Manual turn control messages sent by the client to Agora over RTM */
export interface TurnControlMessage {
  /** 'sos' = Start of Speech, 'eos' = End of Speech */
  type: 'sos' | 'eos';
  userId: string;
  timestamp: number;
}

/** A single turn in the conversation transcript */
export interface TranscriptEntry {
  id: string;
  role: 'user' | 'agent';
  text: string;
  timestamp: number;
}

/** Overall agent session state managed by useAgentState hook */
export interface AgentState {
  status: AgentStateType;
  transcript: TranscriptEntry[];
  isConnected: boolean;
  agentUid: string | null;
}
