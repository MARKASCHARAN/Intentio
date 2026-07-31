/**
 * SettingsScreen — user preferences and session info.
 *
 * Settings:
 * - Toggle Auto-listen (VAD) vs Push-to-talk (Manual Turn Control)
 * - Estimated AI Engine minutes remaining (local counter)
 * - Clear conversation history
 */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {Header} from '../components/Header';
import {Colors, Typography, Spacing, Radius, SharedStyles} from '../components/styles';

interface SettingsScreenProps {
  isPushToTalk: boolean;
  onTogglePushToTalk: (value: boolean) => void;
  estimatedMinutesUsed?: number;
  onClearHistory: () => void;
  onBack: () => void;
}

const TOTAL_FREE_MINUTES = 300;

export function SettingsScreen({
  isPushToTalk,
  onTogglePushToTalk,
  estimatedMinutesUsed = 0,
  onClearHistory,
  onBack,
}: SettingsScreenProps): React.JSX.Element {
  const minutesRemaining = Math.max(0, TOTAL_FREE_MINUTES - estimatedMinutesUsed);
  const pctUsed = Math.min(100, (estimatedMinutesUsed / TOTAL_FREE_MINUTES) * 100);

  const handleClearHistory = () => {
    Alert.alert(
      'Clear History',
      'This will erase your conversation transcript. Are you sure?',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Clear', style: 'destructive', onPress: onClearHistory},
      ],
    );
  };

  return (
    <SafeAreaView style={SharedStyles.screenContainer}>
      <Header title="Settings" showBack onBackPress={onBack} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Turn Control */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Conversation Mode</Text>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>
                {isPushToTalk ? '🎙️ Push-to-Talk' : '🎤 Auto-Listen (VAD)'}
              </Text>
              <Text style={styles.settingDesc}>
                {isPushToTalk
                  ? 'Hold the mic button to speak. Sends SoS/EoS via RTM.'
                  : 'Voice Activity Detection — speaks automatically when silence detected.'}
              </Text>
            </View>
            <Switch
              value={isPushToTalk}
              onValueChange={onTogglePushToTalk}
              trackColor={{false: Colors.surfaceBorder, true: Colors.accent}}
              thumbColor={isPushToTalk ? Colors.textPrimary : Colors.textMuted}
              accessibilityLabel="Toggle push to talk mode"
            />
          </View>
        </View>

        {/* AI Engine Minutes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI Engine Usage</Text>
          <View style={styles.usageCard}>
            <View style={styles.usageHeader}>
              <Text style={styles.usageTitle}>Free Trial Minutes</Text>
              <Text style={styles.usageCount}>
                <Text style={styles.usageBold}>{minutesRemaining}</Text>
                {' / '}{TOTAL_FREE_MINUTES} remaining
              </Text>
            </View>

            {/* Progress bar */}
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${pctUsed}%` as any,
                    backgroundColor:
                      pctUsed > 80 ? Colors.error : Colors.accent,
                  },
                ]}
              />
            </View>

            <Text style={styles.usageWarning}>
              ⚠️ 300 minutes are ONE-TIME. Reserve for final demo recording.
            </Text>
          </View>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data</Text>
          <TouchableOpacity
            style={styles.dangerButton}
            onPress={handleClearHistory}
            accessibilityLabel="Clear conversation history"
            accessibilityRole="button">
            <Text style={styles.dangerButtonText}>🗑️  Clear Conversation History</Text>
          </TouchableOpacity>
        </View>

        {/* Version */}
        <Text style={styles.version}>Intentio v1.0.0 · EchoSphere Hackathon</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: Spacing.md,
    gap: Spacing.lg,
  },
  section: {
    gap: Spacing.sm,
  },
  sectionTitle: {
    color: Colors.accent,
    fontSize: Typography.sizeXS,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    gap: Spacing.md,
  },
  settingInfo: {
    flex: 1,
    gap: 4,
  },
  settingLabel: {
    color: Colors.textPrimary,
    fontSize: Typography.sizeBase,
    fontWeight: '600',
  },
  settingDesc: {
    color: Colors.textSecondary,
    fontSize: Typography.sizeXS,
    lineHeight: 18,
  },
  usageCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    gap: Spacing.sm,
  },
  usageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  usageTitle: {
    color: Colors.textPrimary,
    fontSize: Typography.sizeSM,
    fontWeight: '600',
  },
  usageCount: {
    color: Colors.textSecondary,
    fontSize: Typography.sizeXS,
  },
  usageBold: {
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  progressBar: {
    height: 6,
    backgroundColor: Colors.surfaceBorder,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: Radius.full,
  },
  usageWarning: {
    color: Colors.textMuted,
    fontSize: Typography.sizeXXS,
    fontStyle: 'italic',
  },
  dangerButton: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.error,
    alignItems: 'center',
  },
  dangerButtonText: {
    color: Colors.error,
    fontSize: Typography.sizeSM,
    fontWeight: '600',
  },
  version: {
    color: Colors.textMuted,
    fontSize: Typography.sizeXXS,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
