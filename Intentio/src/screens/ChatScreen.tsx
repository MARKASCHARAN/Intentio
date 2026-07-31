/**
 * ChatScreen — Million-Dollar Conversation Screen
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
  onUnmuteAudio?: () => void;
  agentState: ReturnType<typeof useAgentState>;
}

export function ChatScreen({
  connectionState,
  isPushToTalk,
  onPressIn,
  onPressOut,
  onEndSession,
  onSettingsPress,
  onUnmuteAudio,
  agentState,
}: ChatScreenProps): React.JSX.Element {
  const {status, transcript} = agentState;

  const handleMicPress = useCallback(() => {
    onUnmuteAudio?.();
    onPressIn?.();
  }, [onUnmuteAudio, onPressIn]);

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
        onUnmutePress={onUnmuteAudio}
      />

      {/* Agent visualizer card */}
      <View style={styles.visualizerSection}>
        <AgentVisualizer state={status} size={88} />
        <StateIndicator state={status} />

        {/* Audio Test Button */}
        {onUnmuteAudio && (
          <TouchableOpacity
            style={styles.testVoiceBtn}
            onPress={onUnmuteAudio}
            activeOpacity={0.7}>
            <Text style={styles.testVoiceText}>🔊 Tap to Play Agent Voice / Chime</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Transcript container */}
      <View style={styles.transcriptSection}>
        <TranscriptDisplay entries={transcript} />
      </View>

      {/* Glassmorphic Control Dock */}
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
            onPressIn={handleMicPress}
            onPressOut={onPressOut}
            onPress={handleMicPress}
            isActive={status === 'listening'}
            isPushToTalk={isPushToTalk}
            disabled={connectionState === 'DISCONNECTED' || connectionState === 'FAILED'}
            size={76}
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
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    backgroundColor: 'rgba(3, 7, 18, 0.8)',
    gap: 8,
  },
  testVoiceBtn: {
    backgroundColor: 'rgba(0, 242, 254, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 254, 0.4)',
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radius.full,
    marginTop: 4,
  },
  testVoiceText: {
    color: Colors.accent,
    fontSize: Typography.sizeXXS + 1,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  transcriptSection: {
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    backgroundColor: 'rgba(3, 7, 18, 0.6)',
  },
  controlsSection: {
    paddingBottom: Spacing.lg + 4,
    paddingTop: Spacing.md,
    alignItems: 'center',
    gap: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    backgroundColor: 'rgba(11, 15, 25, 0.95)',
  },
  hint: {
    color: Colors.textMuted,
    fontSize: Typography.sizeXS,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xl + 4,
  },
  endButton: {
    width: 50,
    height: 50,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.4)',
  },
  endButtonText: {
    color: Colors.error,
    fontSize: 20,
    fontWeight: '700',
  },
  settingsButton: {
    width: 50,
    height: 50,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  settingsButtonText: {
    fontSize: 20,
  },
});
