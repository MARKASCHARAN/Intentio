/**
 * ChatScreen — main conversation screen.
 *
 * Features:
 * - AgentVisualizer with real-time state (Agora v2.9 RTM state notifications)
 * - StateIndicator text label
 * - TranscriptDisplay scrollable history
 * - MicButton with push-to-talk (Agora v2.9 Manual Turn Control)
 * - End session button & Settings button
 * - Header with connection status
 */
import React, {useCallback} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  SafeAreaView,
  Alert,
  Platform,
} from 'react-native';
import {Header} from '../components/Header';
import {AgentVisualizer} from '../components/AgentVisualizer';
import {StateIndicator} from '../components/StateIndicator';
import {MicButton} from '../components/MicButton';
import {TranscriptDisplay} from '../components/TranscriptDisplay';
import {Colors, Typography, Spacing, Radius, SharedStyles} from '../components/styles';
import {useAgentState} from '../hooks/useAgentState';
import {stopAgent} from '../services/agentService';
import logger from '../utils/logger';
import type {AgoraConnectionState} from '../types/rtc';

const TAG = 'ChatScreen';

interface ChatScreenProps {
  connectionState: AgoraConnectionState;
  isPushToTalk: boolean;
  onPressIn: () => void;
  onPressOut: () => void;
  onEndSession: () => void;
  onSettingsPress: () => void;
  agentState: ReturnType<typeof useAgentState>;
}

export function ChatScreen({
  connectionState,
  isPushToTalk,
  onPressIn,
  onPressOut,
  onEndSession,
  onSettingsPress,
  agentState,
}: ChatScreenProps): React.JSX.Element {
  const {status, transcript} = agentState;

  const handleEndSession = useCallback(async () => {
    const confirmEnd = async () => {
      try {
        await stopAgent();
      } catch (err) {
        logger.warn(TAG, 'Error stopping agent:', err);
      }
      onEndSession();
    };

    if (Platform.OS === 'web') {
      const gWindow = typeof window !== 'undefined' ? (window as any) : null;
      if (gWindow && gWindow.confirm('Are you sure you want to end this voice session?')) {
        await confirmEnd();
      }
    } else {
      Alert.alert(
        'End Session',
        'Are you sure you want to end this voice session?',
        [
          {text: 'Cancel', style: 'cancel'},
          {
            text: 'End Session',
            style: 'destructive',
            onPress: confirmEnd,
          },
        ],
      );
    }
  }, [onEndSession]);

  return (
    <SafeAreaView style={SharedStyles.screenContainer}>
      {/* Header */}
      <Header
        title="Intentio"
        connectionState={connectionState}
        onSettingsPress={onSettingsPress}
      />

      {/* Agent visualizer + state */}
      <View style={styles.visualizerSection}>
        <AgentVisualizer state={status} size={80} />
        <StateIndicator state={status} />
      </View>

      {/* Transcript */}
      <View style={styles.transcriptSection}>
        <TranscriptDisplay entries={transcript} />
      </View>

      {/* Controls */}
      <View style={styles.controlsSection}>
        {/* Push-to-talk hint */}
        <Text style={styles.hint}>
          {isPushToTalk ? 'Hold mic to speak' : 'Tap mic to speak / toggle voice'}
        </Text>

        {/* Mic + End + Settings row */}
        <View style={styles.controlsRow}>
          {/* End session button */}
          <TouchableOpacity
            style={styles.endButton}
            onPress={handleEndSession}
            accessibilityLabel="End voice session"
            accessibilityRole="button">
            <Text style={styles.endButtonText}>✕</Text>
          </TouchableOpacity>

          {/* Mic button */}
          <MicButton
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            onPress={onPressIn}
            isActive={status === 'listening'}
            isPushToTalk={isPushToTalk}
            disabled={connectionState === 'DISCONNECTED' || connectionState === 'FAILED'}
            size={72}
          />

          {/* Settings button */}
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={onSettingsPress}
            accessibilityLabel="Settings"
            accessibilityRole="button">
            <Text style={styles.settingsButtonText}>⚙️</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  visualizerSection: {
    alignItems: 'center',
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
  },
  transcriptSection: {
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceBorder,
  },
  controlsSection: {
    paddingBottom: Spacing.xl,
    paddingTop: Spacing.md,
    alignItems: 'center',
    gap: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceBorder,
    backgroundColor: Colors.surface,
  },
  hint: {
    color: Colors.textMuted,
    fontSize: Typography.sizeXS,
    fontStyle: 'italic',
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xl,
  },
  endButton: {
    width: 48,
    height: 48,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.error,
    cursor: 'pointer',
  },
  endButtonText: {
    color: Colors.error,
    fontSize: 18,
    fontWeight: '700',
  },
  settingsButton: {
    width: 48,
    height: 48,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    cursor: 'pointer',
  },
  settingsButtonText: {
    fontSize: 18,
  },
});
