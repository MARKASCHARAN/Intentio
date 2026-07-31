/**
 * Web mock for react-native-agora native bindings.
 * Prevents Metro codegen errors when building for Web platform.
 */
export function createAgoraRtcEngine() {
  return {
    initialize: () => {},
    setAudioScenario: () => {},
    enableAudio: () => {},
    joinChannel: () => {},
    leaveChannel: () => {},
    addListener: () => {},
    removeAllListeners: () => {},
    release: () => {},
  };
}

export const ChannelProfileType = {
  ChannelProfileLiveBroadcasting: 1,
};

export const ClientRoleType = {
  ClientRoleBroadcaster: 1,
  ClientRoleAudience: 2,
};

export const AudioScenarioType = {
  AudioScenarioAiClient: 10,
};

export default {
  createAgoraRtcEngine,
  ChannelProfileType,
  ClientRoleType,
  AudioScenarioType,
};
