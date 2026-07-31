/**
 * useAgoraEngine.web.ts — Web implementation using agora-rtc-sdk-ng.
 *
 * Supports:
 * - Web Browsers (Chrome, Safari, Edge) via agora-rtc-sdk-ng
 * - Listens for stream-message from Agora AI Agent (state notifications & transcripts)
 * - HTML5 MediaStream DOM audio playback for Chrome autoplay compliance
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
}

export function useAgoraEngine(options?: UseAgoraEngineOptions): UseAgoraEngineReturn {
  const webClientRef = useRef<any>(null);
  const localAudioTrackRef = useRef<any>(null);
  const onMessageRef = useRef(options?.onMessage);
  onMessageRef.current = options?.onMessage;

  const [state, setState] = useState<AgoraEngineState>({
    isJoined: false,
    isInitialized: false,
    localUid: 0,
    remoteUids: [],
    connectionState: 'DISCONNECTED',
  });

  // ─── Initialize Web Engine ──────────────────────────────────────────────────
  useEffect(() => {
    console.log('[Intentio WebRTC] Initializing Agora Web SDK...');
    try {
      const AgoraRTC = require('agora-rtc-sdk-ng');
      AgoraRTC.setLogLevel(1); // Detailed logging
      setState(prev => ({...prev, isInitialized: true}));
      console.log('[Intentio WebRTC] Agora Web SDK initialized successfully.');
    } catch (err) {
      console.error('[Intentio WebRTC] Failed to initialize Agora Web SDK:', err);
    }

    return () => {
      // Do not auto-leave on re-renders — leaveChannel handles explicit cleanup on session end
    };
  }, []);

  // ─── Join Channel ───────────────────────────────────────────────────────────
  const joinChannel = useCallback(
    async (token: string, channelName: string, uid: number): Promise<void> => {
      console.log(`[Intentio WebRTC] joining channel=${channelName}, uid=${uid}`);
      setState(prev => ({...prev, connectionState: 'CONNECTING'}));

      try {
        const AgoraRTC = require('agora-rtc-sdk-ng');
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

            // Ensure a dedicated HTML5 <audio> element exists in DOM for reliable Chrome playback
            const gDoc = typeof document !== 'undefined' ? document : null;
            let audioEl: HTMLAudioElement | null = null;
            if (gDoc) {
              audioEl = gDoc.getElementById('agora-remote-audio') as HTMLAudioElement;
              if (!audioEl) {
                audioEl = gDoc.createElement('audio');
                audioEl.id = 'agora-remote-audio';
                audioEl.autoplay = true;
                gDoc.body.appendChild(audioEl);
              }
            }

            const playTrack = async () => {
              try {
                user.audioTrack?.setVolume(100);
                user.audioTrack?.play();

                const rawTrack = user.audioTrack?.getMediaStreamTrack();
                if (rawTrack && audioEl) {
                  audioEl.srcObject = new MediaStream([rawTrack]);
                  await audioEl.play();
                }
                console.log(`[Intentio WebRTC] PLAYING REMOTE AUDIO STREAM FOR ${user.uid} 🎉`);
              } catch (playErr) {
                console.warn('[Intentio WebRTC] Autoplay blocked, attaching click listener:', playErr);
              }
            };

            await playTrack();

            // Click listener fallback to guarantee playback
            if (gDoc) {
              const resumeOnClick = async () => {
                await playTrack();
                gDoc.removeEventListener('click', resumeOnClick);
              };
              gDoc.addEventListener('click', resumeOnClick);
            }
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
    [],
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

    const gDoc = typeof document !== 'undefined' ? document : null;
    const audioEl = gDoc?.getElementById('agora-remote-audio') as HTMLAudioElement;
    if (audioEl) {
      audioEl.srcObject = null;
    }

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
  };
}
