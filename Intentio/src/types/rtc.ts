/**
 * Agora RTC event and configuration types.
 */
import type {ChannelProfileType, ClientRoleType} from 'react-native-agora';

/** Configuration passed to the Agora RTC engine on initialization */
export interface AgoraEngineConfig {
  appId: string;
  channelProfile?: ChannelProfileType;
  clientRole?: ClientRoleType;
}

/** State managed by the useAgoraEngine hook */
export interface AgoraEngineState {
  isJoined: boolean;
  isInitialized: boolean;
  localUid: number;
  remoteUids: number[];
  connectionState: AgoraConnectionState;
}

/** Agora connection state enum (maps to SDK values) */
export type AgoraConnectionState =
  | 'DISCONNECTED'
  | 'CONNECTING'
  | 'CONNECTED'
  | 'RECONNECTING'
  | 'FAILED';

/** Audio volume info for VoIP visualization */
export interface VolumeInfo {
  uid: number;
  volume: number;
  vad: number;
}
