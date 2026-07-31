/**
 * useAgoraEngine.web.ts — Web implementation using agora-rtc-sdk-ng.
 *
 * Supports:
 * - Web Browsers (Chrome, Safari, Edge) via agora-rtc-sdk-ng
 * - Listens for stream-message from Agora AI Agent (state notifications & transcripts)
 * - Direct WebAudio MediaStreamAudioSourceNode pipeline to ctx.destination
 */
import {useState, useEffect, useCallback, useRef} from 'react';
import {AGORA_APP_ID} from '../utils/constants';
import logger from '../utils/logger';
import type {AgoraEngineState, AgoraConnectionState} from '../types/rtc';

const TAG = 'useAgoraEngine[Web]';

interface UseAgoraEngineOptions {
  onMessage?: (message: string, senderId: string) => void;
}

interface UseAgoraEngineReturn extends AgoraEngineState {
  engine: any;
  joinChannel: (token: string, channelName: string, uid: number) => Promise<void>;
  leaveChannel: () => Promise<void>;
  unmuteAudio: () => void;
}

export function useAgoraEngine(options?: UseAgoraEngineOptions): UseAgoraEngineReturn {
  const webClientRef = useRef<any>(null);
  const localAudioTrackRef = useRef<any>(null);
  const globalAudioCtxRef = useRef<any>(null);
  const activeAudioNodesRef = useRef<Map<string, any>>(new Map());

  const onMessageRef = useRef(options?.onMessage);
  onMessageRef.current = options?.onMessage;

  const [state, setState] = useState<AgoraEngineState>({
    isJoined: false,
    isInitialized: false,
    localUid: 0,
    remoteUids: [],
    connectionState: 'DISCONNECTED',
  });

  // ─── Shared WebAudio Context Singleton ──────────────────────────────────
  const getGlobalAudioContext = useCallback(() => {
    if (typeof window === 'undefined') return null;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return null;
      if (!globalAudioCtxRef.current || globalAudioCtxRef.current.state === 'closed') {
        globalAudioCtxRef.current = new AudioCtx();
      }
      if (globalAudioCtxRef.current.state === 'suspended') {
        globalAudioCtxRef.current.resume();
      }
      return globalAudioCtxRef.current;
    } catch (e) {
      console.warn('[Intentio WebRTC] AudioContext init note:', e);
      return null;
    }
  }, []);

  // ─── Play Audio Chime via WebAudio ──────────────────────────────────────
  const playWebAudioChime = useCallback(() => {
    const ctx = getGlobalAudioContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
      console.log('[Intentio WebRTC] WebAudio chime played — Hardware speaker output UNLOCKED! 🔊');
    } catch (e) {
      console.warn('[Intentio WebRTC] WebAudio chime note:', e);
    }
  }, [getGlobalAudioContext]);

  // ─── Pipe WebRTC Track into WebAudio Destination Node ───────────────────
  const pipeTrackToWebAudio = useCallback((user: any) => {
    if (!user || !user.audioTrack) return;

    try {
      user.audioTrack.setVolume(1000);
      user.audioTrack.play();
      console.log(`[Intentio WebRTC] Executed audioTrack.play() for user ${user.uid}! 🔊`);
    } catch (e) {
      console.warn('[Intentio WebRTC] audioTrack.play note:', e);
    }

    const ctx = getGlobalAudioContext();
    if (!ctx) return;

    try {
      const rawTrack = user.audioTrack.getMediaStreamTrack();
      if (rawTrack) {
        const stream = new MediaStream([rawTrack]);
        const nodeKey = String(user.uid);

        // Cleanup prior node if exists
        const existingNode = activeAudioNodesRef.current.get(nodeKey);
        if (existingNode) {
          try { existingNode.disconnect(); } catch (e) {}
        }

        const sourceNode = ctx.createMediaStreamSource(stream);
        sourceNode.connect(ctx.destination);
        activeAudioNodesRef.current.set(nodeKey, sourceNode);
        console.log(`[Intentio WebRTC] Piped WebRTC audio stream for UID ${user.uid} directly to WebAudio destination node! 🔊🎉`);
      }
    } catch (e) {
      console.warn('[Intentio WebRTC] WebAudio node piping note:', e);
    }
  }, [getGlobalAudioContext]);

  // ─── Unmute All Remote Audio Streams ──────────────────────────────────────
  const unmuteAudio = useCallback(() => {
    playWebAudioChime();

    if (webClientRef.current) {
      const remoteUsers = webClientRef.current.remoteUsers || [];
      console.log(`[Intentio WebRTC] Unmuting ${remoteUsers.length} remote users...`);

      remoteUsers.forEach((user: any) => {
        pipeTrackToWebAudio(user);
      });
    }
  }, [playWebAudioChime, pipeTrackToWebAudio]);

  // ─── Initialize Web Engine ──────────────────────────────────────────────────
  useEffect(() => {
    console.log('[Intentio WebRTC] Initializing Agora Web SDK...');
    try {
      const AgoraRTC = require('agora-rtc-sdk-ng');
      AgoraRTC.setLogLevel(1);
      setState(prev => ({...prev, isInitialized: true}));
      console.log('[Intentio WebRTC] Agora Web SDK initialized successfully.');
    } catch (err) {
      console.error('[Intentio WebRTC] Failed to initialize Agora Web SDK:', err);
    }
  }, []);

  // ─── Join Channel ───────────────────────────────────────────────────────────
  const joinChannel = useCallback(
    async (token: string, channelName: string, uid: number): Promise<void> => {
      console.log(`[Intentio WebRTC] joining channel=${channelName}, uid=${uid}`);
      playWebAudioChime();
      setState(prev => ({...prev, connectionState: 'CONNECTING'}));

      try {
        const AgoraRTC = require('agora-rtc-sdk-ng');

        // Cleanup any prior active client instance before joining
        if (webClientRef.current) {
          try {
            await webClientRef.current.leave();
          } catch (e) {
            console.warn('[Intentio WebRTC] Prior client leave info:', e);
          }
          webClientRef.current = null;
        }

        const client = AgoraRTC.createClient({mode: 'rtc', codec: 'vp8'});
        webClientRef.current = client;

        // ─── Stream Message Listener (Agora AI Agent State & Transcripts) ──────
        client.on('stream-message', (senderUid: number, data: Uint8Array) => {
          try {
            const decoder = typeof TextDecoder !== 'undefined' ? new TextDecoder() : null;
            const text = decoder ? decoder.decode(data) : String.fromCharCode.apply(null, Array.from(data));
            console.log(`[Intentio Agent StreamMessage] from ${senderUid}:`, text);
            onMessageRef.current?.(text, String(senderUid));
          } catch (err) {
            console.warn('[Intentio WebRTC] Error decoding stream message:', err);
          }
        });

        // ─── Remote User Published Media Listener (AI Agent Audio) ───────────
        client.on('user-published', async (user: any, mediaType: string) => {
          console.log(`[Intentio WebRTC] Remote user published: ${user.uid}, mediaType: ${mediaType}`);
          await client.subscribe(user, mediaType);

          if (mediaType === 'audio') {
            console.log(`[Intentio WebRTC] Subscribed to remote audio track of ${user.uid}`);
            pipeTrackToWebAudio(user);
          }
        });

        client.on('user-joined', (user: any) => {
          console.log(`[Intentio WebRTC] Remote user joined channel: ${user.uid}`);
          setState(prev => ({
            ...prev,
            remoteUids: [...prev.remoteUids, Number(user.uid)],
          }));
        });

        client.on('user-left', (user: any) => {
          console.log(`[Intentio WebRTC] Remote user left channel: ${user.uid}`);
          setState(prev => ({
            ...prev,
            remoteUids: prev.remoteUids.filter(id => id !== Number(user.uid)),
          }));
        });

        // Join channel with numeric integer UID matching RTC token
        const joinedUid = await client.join(
          AGORA_APP_ID,
          channelName,
          token,
          Number(uid) || null,
        );

        console.log(`[Intentio WebRTC] Joined channel as UID: ${joinedUid}`);

        // Capture microphone and un-mute explicitly
        let audioTrack;
        try {
          audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
        } catch (e) {
          console.warn('[Intentio WebRTC] Default mic track failed, trying fallback:', e);
          audioTrack = await AgoraRTC.createMicrophoneAudioTrack({encoderConfig: 'speech_standard'});
        }

        if (audioTrack) {
          await audioTrack.setEnabled(true);
          await audioTrack.setMuted(false);
          const mediaTrack = audioTrack.getMediaStreamTrack();
          console.log(`[Intentio WebRTC] Mic device captured: "${mediaTrack?.label}" (State: ${mediaTrack?.readyState}, Muted: ${audioTrack.isMuted})`);

          localAudioTrackRef.current = audioTrack;
          await client.publish([audioTrack]);
          console.log('[Intentio WebRTC] Local microphone track PUBLISHED to channel.');
        }

        setState({
          isJoined: true,
          isInitialized: true,
          localUid: Number(joinedUid) || uid,
          remoteUids: [],
          connectionState: 'CONNECTED',
        });
      } catch (err) {
        console.error('[Intentio WebRTC] Join channel error:', err);
        setState(prev => ({...prev, connectionState: 'FAILED'}));
        throw err;
      }
    },
    [playWebAudioChime, pipeTrackToWebAudio],
  );

  // ─── Leave Channel ──────────────────────────────────────────────────────────
  const leaveChannel = useCallback(async (): Promise<void> => {
    console.log('[Intentio WebRTC] Leaving channel...');

    if (localAudioTrackRef.current) {
      localAudioTrackRef.current.close();
      localAudioTrackRef.current = null;
    }

    if (webClientRef.current) {
      await webClientRef.current.leave();
      webClientRef.current = null;
    }

    activeAudioNodesRef.current.forEach((node) => {
      try { node.disconnect(); } catch (e) {}
    });
    activeAudioNodesRef.current.clear();

    setState({
      isJoined: false,
      isInitialized: true,
      localUid: 0,
      remoteUids: [],
      connectionState: 'DISCONNECTED',
    });
  }, []);

  return {
    ...state,
    engine: webClientRef.current,
    joinChannel,
    leaveChannel,
    unmuteAudio,
  };
}
