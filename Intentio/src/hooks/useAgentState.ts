/**
 * useAgentState — subscribes to Agora RTM / Stream Messages and drives agent state.
 *
 * Agora v2.9 Feature: Agent State Notifications & Transcripts over Stream Messages.
 * Handles Agora v2.9 protocol format: "message_id|part|total|base64_payload"
 */
import {useState, useCallback, useRef} from 'react';
import type {AgentState, AgentStateType, TranscriptEntry} from '../types/agent';
import logger from '../utils/logger';

const TAG = 'useAgentState';

interface UseAgentStateReturn extends AgentState {
  handleRTMMessage: (message: string, senderId: string) => void;
  addTranscriptEntry: (role: 'user' | 'agent', text: string) => void;
  resetState: () => void;
}

const INITIAL_STATE: AgentState = {
  status: 'idle',
  transcript: [],
  isConnected: false,
  agentUid: null,
};

export function useAgentState(): UseAgentStateReturn {
  const [state, setState] = useState<AgentState>(INITIAL_STATE);
  const transcriptIdRef = useRef(0);

  /** Adds a new entry to the conversation transcript */
  const addTranscriptEntry = useCallback(
    (role: 'user' | 'agent', text: string) => {
      const entry: TranscriptEntry = {
        id: `${Date.now()}-${transcriptIdRef.current++}`,
        role,
        text,
        timestamp: Date.now(),
      };
      setState(prev => ({
        ...prev,
        transcript: [...prev.transcript, entry],
      }));
    },
    [],
  );

  /**
   * Decodes Agora v2.9 agent stream message payload.
   * Format: "message_id|part_num|total_parts|base64_json"
   */
  const parseAgoraMessage = (raw: string): any => {
    let payloadStr = raw;

    // Check for Agora v2.9 pipe format
    if (raw.includes('|')) {
      const parts = raw.split('|');
      const base64Segment = parts[parts.length - 1];
      try {
        if (typeof atob !== 'undefined') {
          payloadStr = atob(base64Segment);
        } else if (typeof Buffer !== 'undefined') {
          payloadStr = Buffer.from(base64Segment, 'base64').toString('utf-8');
        }
      } catch (e) {
        // Not base64, fallback to raw
        payloadStr = raw;
      }
    }

    try {
      return JSON.parse(payloadStr);
    } catch {
      return {rawText: payloadStr};
    }
  };

  /**
   * Called whenever a Stream / RTM message is received from Agora Agent.
   */
  const handleRTMMessage = useCallback(
    (message: string, senderId: string) => {
      logger.info(TAG, `Stream message from ${senderId}:`, message);

      const parsed = parseAgoraMessage(message);
      logger.info(TAG, 'Parsed Agora v2.9 payload:', parsed);

      const dataType = String(parsed.data_type || parsed.type || parsed.event_type || parsed.status || parsed.state || '').toLowerCase();
      const agentStateVal = String(parsed.state || parsed.status || '').toLowerCase();

      // ─── Agent State Transitions ──────────────────────────────────────────
      if (agentStateVal.includes('listening') || dataType.includes('listening')) {
        logger.info(TAG, 'Agent → LISTENING');
        setState(prev => ({
          ...prev,
          status: 'listening',
          agentUid: senderId,
          isConnected: true,
        }));
      } else if (agentStateVal.includes('thinking') || dataType.includes('thinking')) {
        logger.info(TAG, 'Agent → THINKING');
        setState(prev => ({...prev, status: 'thinking'}));
      } else if (agentStateVal.includes('speaking') || dataType.includes('speaking')) {
        logger.info(TAG, 'Agent → SPEAKING');
        setState(prev => ({...prev, status: 'speaking'}));
      } else if (agentStateVal.includes('idle') || dataType.includes('idle')) {
        logger.info(TAG, 'Agent → IDLE');
        setState(prev => ({...prev, status: 'idle'}));
      } else if (senderId === '999999' || parsed.greeting_user_joined_at_ms) {
        // Agent joined & greeting stream event received — mark connected
        setState(prev => ({
          ...prev,
          isConnected: true,
          agentUid: senderId,
        }));
      }

      // ─── Transcripts ──────────────────────────────────────────────────────
      const text = parsed.text || parsed.content || parsed.message || parsed.transcript;
      if (text && typeof text === 'string' && text.trim().length > 0) {
        const isUser = parsed.role === 'user' || dataType.includes('user') || parsed.module === 'ASR';
        const role = isUser ? 'user' : 'agent';
        addTranscriptEntry(role, text.trim());
      }
    },
    [addTranscriptEntry],
  );

  /** Resets state to initial values — call when session ends */
  const resetState = useCallback(() => {
    setState(INITIAL_STATE);
    transcriptIdRef.current = 0;
    logger.info(TAG, 'State reset');
  }, []);

  return {
    ...state,
    handleRTMMessage,
    addTranscriptEntry,
    resetState,
  };
}
