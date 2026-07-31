/**
 * useAgentState — subscribes to Agora RTM / Stream Messages and drives agent state.
 *
 * Agora v2.9 Feature: Agent State Notifications & Transcripts over Stream Messages.
 * Handles Agora v2.9 multi-part protocol format: "message_id|part_num|total_parts|base64_payload"
 */
import {useState, useCallback, useRef} from 'react';
import type {AgentState, AgentStateType, TranscriptEntry} from '../types/agent';
import logger from '../utils/logger';

const TAG = 'useAgentState';

interface UseAgentStateReturn extends AgentState {
  handleRTMMessage: (message: string, senderId: string) => void;
  addTranscriptEntry: (role: 'user' | 'agent', text: string, isPartial?: boolean) => void;
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
  const multiPartBufferRef = useRef<Map<string, {parts: Map<number, string>; total: number}>>(new Map());

  /** Updates current partial transcript in-place, or appends a new entry */
  const addTranscriptEntry = useCallback(
    (role: 'user' | 'agent', text: string, isPartial: boolean = false) => {
      const cleanText = text.trim();
      if (!cleanText) return;

      setState(prev => {
        const lastIndex = prev.transcript.length - 1;
        const lastEntry = prev.transcript[lastIndex];

        // If last entry matches current role and was partial, update in-place
        if (lastEntry && lastEntry.role === role && (lastEntry as any).isPartial) {
          const updated = [...prev.transcript];
          updated[lastIndex] = {
            ...lastEntry,
            text: cleanText,
            timestamp: Date.now(),
            ...(isPartial ? {isPartial: true} : {}),
          };
          if (!isPartial) {
            delete (updated[lastIndex] as any).isPartial;
          }
          return {...prev, transcript: updated};
        }

        // Append new entry
        const entry: TranscriptEntry & {isPartial?: boolean} = {
          id: `${Date.now()}-${transcriptIdRef.current++}`,
          role,
          text: cleanText,
          timestamp: Date.now(),
          ...(isPartial ? {isPartial: true} : {}),
        };
        return {...prev, transcript: [...prev.transcript, entry]};
      });
    },
    [],
  );

  /**
   * Decodes Agora v2.9 agent stream message payload.
   * Handles multi-part packets: "message_id|part_num|total_parts|base64_json"
   */
  const parseAgoraMessage = (raw: string): any => {
    let payloadStr = raw;

    if (raw.includes('|')) {
      const parts = raw.split('|');
      if (parts.length >= 4) {
        const msgId = parts[0];
        const partNum = parseInt(parts[1], 10);
        const totalParts = parseInt(parts[2], 10);
        const chunk = parts.slice(3).join('|');

        if (totalParts > 1) {
          let buffer = multiPartBufferRef.current.get(msgId);
          if (!buffer) {
            buffer = {parts: new Map(), total: totalParts};
            multiPartBufferRef.current.set(msgId, buffer);
          }
          buffer.parts.set(partNum, chunk);

          // Check if all parts have arrived
          if (buffer.parts.size === totalParts) {
            let combinedBase64 = '';
            for (let i = 1; i <= totalParts; i++) {
              combinedBase64 += buffer.parts.get(i) || '';
            }
            multiPartBufferRef.current.delete(msgId);

            try {
              if (typeof atob !== 'undefined') {
                payloadStr = atob(combinedBase64);
              } else if (typeof (globalThis as any).Buffer !== 'undefined') {
                payloadStr = (globalThis as any).Buffer.from(combinedBase64, 'base64').toString('utf-8');
              }
            } catch (e) {
              payloadStr = combinedBase64;
            }
          } else {
            // Waiting for remaining parts
            return null;
          }
        } else {
          // Single-part packet
          try {
            if (typeof atob !== 'undefined') {
              payloadStr = atob(chunk);
            } else if (typeof (globalThis as any).Buffer !== 'undefined') {
              payloadStr = (globalThis as any).Buffer.from(chunk, 'base64').toString('utf-8');
            }
          } catch (e) {
            payloadStr = chunk;
          }
        }
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
      if (!parsed) return; // Multi-part packet buffering in progress

      logger.info(TAG, 'Parsed Agora v2.9 payload:', parsed);

      const dataType = String(parsed.data_type || parsed.type || parsed.event_type || parsed.status || parsed.state || parsed.object || '').toLowerCase();
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

      // ─── Transcripts (In-Place Update for Partial Streaming Chunks) ────────
      const text = parsed.text || parsed.content || parsed.message || parsed.transcript;
      if (text && typeof text === 'string' && text.trim().length > 0) {
        const isUser = parsed.role === 'user' || dataType.includes('user') || parsed.module === 'ASR' || parsed.object === 'user.transcription';
        const role = isUser ? 'user' : 'agent';

        // Check if turn is final or in progress
        const isPartial = parsed.turn_status === 0 || parsed.is_final === false;
        addTranscriptEntry(role, text.trim(), isPartial);
      }
    },
    [addTranscriptEntry],
  );

  /** Resets state to initial values — call when session ends */
  const resetState = useCallback(() => {
    setState(INITIAL_STATE);
    transcriptIdRef.current = 0;
    multiPartBufferRef.current.clear();
    logger.info(TAG, 'State reset');
  }, []);

  return {
    ...state,
    handleRTMMessage,
    addTranscriptEntry,
    resetState,
  };
}
