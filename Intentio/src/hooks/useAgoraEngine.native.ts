/**
 * useAgoraEngine.native.ts — Native Android/iOS implementation using react-native-agora.
 *
 * Used automatically by React Native / Metro when building for mobile platforms.
 */
import {useState, useEffect, useCallback, useRef} from 'react';
import {
  createAgoraRtcEngine,
  IRtcEngine,
  ChannelProfileType,
  ClientRoleType,
  AudioScenarioType,
} from 'react-native-agora';
import {AGORA_APP_ID} from '../utils/constants';
import logger from '../utils/logger';
import type {AgoraEngineState, AgoraConnectionState} from '../types/rtc';

const TAG = 'useAgoraEngine[Native]';

interface UseAgoraEngineReturn extends AgoraEngineState {
  engine: IRtcEngine | null;
  joinChannel: (token: string, channelName: string, uid: number) => Promise<void>;
  leaveChannel: () => Promise<void>;
}

export function useAgoraEngine(): UseAgoraEngineReturn {
  const engineRef = useRef<IRtcEngine | null>(null);
  const [state, setState] = useState<AgoraEngineState>({
    isJoined: false,
    isInitialized: false,
    localUid: 0,
    remoteUids: [],
    connectionState: 'DISCONNECTED',
  });

  useEffect(() => {
    logger.info(TAG, 'Initializing Native RTC engine');
    try {
      const engine = createAgoraRtcEngine();
      engineRef.current = engine;

      engine.initialize({
        appId: AGORA_APP_ID,
        channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
      });

      engine.setAudioScenario(AudioScenarioType.AudioScenarioAiClient);
      engine.enableAudio();

      engine.addListener('onJoinChannelSuccess', (connection, elapsed) => {
        logger.info(TAG, `Joined channel: ${connection.channelId}`);
        setState(prev => ({
          ...prev,
          isJoined: true,
          localUid: connection.localUid ?? 0,
          connectionState: 'CONNECTED',
        }));
      });

      engine.addListener('onUserJoined', (connection, remoteUid) => {
        logger.info(TAG, `Remote user joined: ${remoteUid}`);
        setState(prev => ({
          ...prev,
          remoteUids: [...prev.remoteUids, remoteUid],
        }));
      });

      engine.addListener('onUserOffline', (connection, remoteUid) => {
        logger.info(TAG, `Remote user offline: ${remoteUid}`);
        setState(prev => ({
          ...prev,
          remoteUids: prev.remoteUids.filter(id => id !== remoteUid),
        }));
      });

      engine.addListener('onConnectionStateChanged', (connection, stateVal) => {
        const stateMap: Record<number, AgoraConnectionState> = {
          1: 'DISCONNECTED',
          2: 'CONNECTING',
          3: 'CONNECTED',
          4: 'RECONNECTING',
          5: 'FAILED',
        };
        setState(prev => ({
          ...prev,
          connectionState: stateMap[stateVal] ?? 'DISCONNECTED',
        }));
      });

      setState(prev => ({...prev, isInitialized: true}));
    } catch (err) {
      logger.error(TAG, 'Failed to initialize Native RTC engine:', err);
    }

    return () => {
      if (engineRef.current) {
        engineRef.current.removeAllListeners();
        engineRef.current.release();
        engineRef.current = null;
      }
    };
  }, []);

  const joinChannel = useCallback(
    async (token: string, channelName: string, uid: number): Promise<void> => {
      const engine = engineRef.current;
      if (!engine) throw new Error('Engine not initialized');

      logger.info(TAG, `Joining channel: ${channelName}, uid: ${uid}`);
      setState(prev => ({...prev, connectionState: 'CONNECTING'}));

      engine.joinChannel(token, channelName, uid, {
        clientRoleType: ClientRoleType.ClientRoleBroadcaster,
        publishMicrophoneTrack: true,
        autoSubscribeAudio: true,
      });
    },
    [],
  );

  const leaveChannel = useCallback(async (): Promise<void> => {
    logger.info(TAG, 'Leaving channel');
    if (engineRef.current) {
      engineRef.current.leaveChannel();
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
    engine: engineRef.current,
    joinChannel,
    leaveChannel,
  };
}
