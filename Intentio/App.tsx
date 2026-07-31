/**
 * App.tsx — Root component for Intentio.
 *
 * Responsive Hybrid Layout:
 * - On Desktop Web: Centered, responsive glassmorphic card container (maxWidth 520px, scrollable, zero clipping)
 * - On Mobile Devices: Fills 100% edge-to-edge natively
 */
import React, {useState, useCallback, useRef} from 'react';
import {StatusBar, View, StyleSheet, Platform} from 'react-native';
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
  const {connectionState, joinChannel, leaveChannel, unmuteAudio} = useAgoraEngine({
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

  // ─── Manual Turn Control ──────────────────────────────────────────────────
  const handleMicPressIn = useCallback(() => {
    if (isPushToTalk) {
      logger.info(TAG, '→ SoS (Start of Speech)');
    }
  }, [isPushToTalk]);

  const handleMicPressOut = useCallback(() => {
    if (isPushToTalk) {
      logger.info(TAG, '← EoS (End of Speech)');
    }
  }, [isPushToTalk]);

  // ─── Clear Transcript ─────────────────────────────────────────────────────
  const handleClearHistory = useCallback(() => {
    agentState.resetState();
  }, [agentState]);

  // Render main screen content
  const renderScreen = () => {
    switch (screen) {
      case 'home':
        return <HomeScreen onSessionStart={handleSessionStart} />;
      case 'chat':
        return (
          <ChatScreen
            connectionState={connectionState}
            isPushToTalk={isPushToTalk}
            onPressIn={handleMicPressIn}
            onPressOut={handleMicPressOut}
            onEndSession={handleEndSession}
            onSettingsPress={() => setScreen('settings')}
            onUnmuteAudio={unmuteAudio}
            agentState={agentState}
          />
        );
      case 'settings':
        return (
          <SettingsScreen
            isPushToTalk={isPushToTalk}
            onTogglePushToTalk={setIsPushToTalk}
            estimatedMinutesUsed={minutesUsed}
            onClearHistory={handleClearHistory}
            onBack={() => setScreen('chat')}
          />
        );
    }
  };

  const isWeb = Platform.OS === 'web';

  return (
    <View style={isWeb ? styles.webOuterWrapper : styles.nativeRoot}>
      <StatusBar barStyle="light-content" backgroundColor="#030712" />

      {isWeb ? (
        <View style={styles.webGlassCardContainer}>
          {renderScreen()}
        </View>
      ) : (
        renderScreen()
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  nativeRoot: {
    flex: 1,
    backgroundColor: '#030712',
  },
  webOuterWrapper: {
    flex: 1,
    backgroundColor: '#02040A',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  webGlassCardContainer: {
    width: '100%',
    maxWidth: 520,
    height: '100%',
    maxHeight: 860,
    backgroundColor: '#030712',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 254, 0.25)',
    overflow: 'hidden',
    shadowColor: '#00F2FE',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.25,
    shadowRadius: 30,
    elevation: 16,
  },
});
