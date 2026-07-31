/**
 * App.tsx — Root component for Intentio.
 *
 * Manages:
 * - Screen state machine (home | chat | settings)
 * - Agora RTC engine lifecycle (via useAgoraEngine)
 * - Agent state (via useAgentState — RTM state notifications)
 * - Push-to-talk preference
 * - Manual Turn Control SoS/EoS (Agora v2.9)
 */
import React, {useState, useCallback, useRef} from 'react';
import {StatusBar} from 'react-native';
import {useAgoraEngine} from './src/hooks/useAgoraEngine';
import {useAgentState} from './src/hooks/useAgentState';
import {HomeScreen} from './src/screens/HomeScreen';
import {ChatScreen} from './src/screens/ChatScreen';
import {SettingsScreen} from './src/screens/SettingsScreen';
import {Colors} from './src/components/styles';
import {CHANNEL_NAME} from './src/utils/constants';
import {stopAgent} from './src/services/agentService';
import logger from './src/utils/logger';

const TAG = 'App';

type AppScreen = 'home' | 'chat' | 'settings';

export default function App(): React.JSX.Element {
  const [screen, setScreen] = useState<AppScreen>('home');
  const [isPushToTalk, setIsPushToTalk] = useState(false);
  const [minutesUsed, setMinutesUsed] = useState(0);
  const sessionStartRef = useRef<number | null>(null);

  // ─── Agora Hooks ─────────────────────────────────────────────────────────
  const agentState = useAgentState();
  const {connectionState, joinChannel, leaveChannel} = useAgoraEngine({
    onMessage: agentState.handleRTMMessage,
  });

  // ─── Session Start ────────────────────────────────────────────────────────
  const handleSessionStart = useCallback(
    async (token: string, uid: number) => {
      try {
        await joinChannel(token, CHANNEL_NAME, uid);
        sessionStartRef.current = Date.now();
        setScreen('chat');
        logger.info(TAG, 'Session started, navigated to chat');
      } catch (err) {
        logger.error(TAG, 'Failed to join channel:', err);
      }
    },
    [joinChannel],
  );

  // ─── Session End ──────────────────────────────────────────────────────────
  const handleEndSession = useCallback(async () => {
    try {
      await stopAgent();
    } catch (err) {
      logger.warn(TAG, 'Agent stop error:', err);
    }

    await leaveChannel();

    // Track minutes used (rough estimate)
    if (sessionStartRef.current) {
      const durationMs = Date.now() - sessionStartRef.current;
      const mins = durationMs / 60000;
      setMinutesUsed(prev => prev + mins);
      sessionStartRef.current = null;
    }

    agentState.resetState();
    setScreen('home');
    logger.info(TAG, 'Session ended');
  }, [leaveChannel, agentState]);

  // ─── Manual Turn Control (Agora v2.9) ────────────────────────────────────
  /**
   * Send Start of Speech (SoS) via RTM for manual turn control.
   * In a full implementation, this sends an RTM message to the agent channel.
   * For now, this is the press-in handler stub ready to wire up RTM.
   */
  const handleMicPressIn = useCallback(() => {
    if (isPushToTalk) {
      logger.info(TAG, '→ SoS (Start of Speech) — send via RTM');
      // TODO: rtmClient.publish(channelName, JSON.stringify({ type: 'sos', userId, timestamp: Date.now() }))
    }
  }, [isPushToTalk]);

  const handleMicPressOut = useCallback(() => {
    if (isPushToTalk) {
      logger.info(TAG, '← EoS (End of Speech) — send via RTM');
      // TODO: rtmClient.publish(channelName, JSON.stringify({ type: 'eos', userId, timestamp: Date.now() }))
    }
  }, [isPushToTalk]);

  // ─── Clear Transcript ─────────────────────────────────────────────────────
  const handleClearHistory = useCallback(() => {
    agentState.resetState();
  }, [agentState]);

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Colors.background}
      />

      {screen === 'home' && (
        <HomeScreen onSessionStart={handleSessionStart} />
      )}

      {screen === 'chat' && (
        <ChatScreen
          connectionState={connectionState}
          isPushToTalk={isPushToTalk}
          onPressIn={handleMicPressIn}
          onPressOut={handleMicPressOut}
          onEndSession={handleEndSession}
          onSettingsPress={() => setScreen('settings')}
          agentState={agentState}
        />
      )}

      {screen === 'settings' && (
        <SettingsScreen
          isPushToTalk={isPushToTalk}
          onTogglePushToTalk={setIsPushToTalk}
          estimatedMinutesUsed={minutesUsed}
          onClearHistory={handleClearHistory}
          onBack={() => setScreen('chat')}
        />
      )}
    </>
  );
}
