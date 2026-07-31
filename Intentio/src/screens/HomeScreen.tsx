/**
 * HomeScreen — landing screen with app intro and "Start Session" CTA.
 *
 * Flow:
 * 1. User taps "Start Session"
 * 2. requestPermission() is called
 * 3. If granted: fetch token → join channel → start agent → navigate to ChatScreen
 * 4. If denied: show permission error
 */
import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from 'react-native';
import {Colors, Typography, Spacing, Radius, SharedStyles} from '../components/styles';
import {usePermissions} from '../hooks/usePermissions';
import {fetchToken} from '../services/tokenService';
import {startAgent} from '../services/agentService';
import {CHANNEL_NAME} from '../utils/constants';
import logger from '../utils/logger';

const TAG = 'HomeScreen';

interface HomeScreenProps {
  onSessionStart: (token: string, uid: number) => void;
}

export function HomeScreen({onSessionStart}: HomeScreenProps): React.JSX.Element {
  const {requestPermission, isRequesting} = usePermissions();
  const [isStarting, setIsStarting] = useState(false);

  const handleStart = useCallback(async () => {
    setIsStarting(true);
    try {
      // Step 1: Request microphone permission
      const granted = await requestPermission();
      if (!granted) {
        logger.warn(TAG, 'Microphone permission denied — cannot start session');
        return;
      }

      // Step 2: Fetch RTC + RTM token from backend
      const localUid = Math.floor(Math.random() * 100000) + 1;
      const tokenData = await fetchToken(CHANNEL_NAME, localUid);

      // Step 3: Start AI agent via backend
      await startAgent(CHANNEL_NAME, String(localUid), tokenData.token);

      // Step 4: Navigate to chat screen with token
      onSessionStart(tokenData.token, localUid);
    } catch (err) {
      logger.error(TAG, 'Failed to start session:', err);
      Alert.alert(
        'Connection Failed',
        'Could not connect to Intentio. Please check your network and try again.',
        [{text: 'OK'}],
      );
    } finally {
      setIsStarting(false);
    }
  }, [requestPermission, onSessionStart]);

  const isLoading = isRequesting || isStarting;

  return (
    <SafeAreaView style={SharedStyles.screenContainer}>
      <View style={styles.container}>
        {/* Hero section */}
        <View style={styles.heroSection}>
          <Text style={styles.orbEmoji}>🎯</Text>
          <Text style={styles.appName}>Intentio</Text>
          <Text style={styles.tagline}>Speak your intent. We act.</Text>
          <Text style={styles.subtitle}>
            Your autonomous voice agent — just tell me what you need.
          </Text>
        </View>

        {/* Feature pills */}
        <View style={styles.features}>
          {FEATURES.map(f => (
            <View key={f.text} style={styles.featurePill}>
              <Text style={styles.featureEmoji}>{f.emoji}</Text>
              <Text style={styles.featureText}>{f.text}</Text>
            </View>
          ))}
        </View>

        {/* CTA */}
        <TouchableOpacity
          style={[styles.startButton, isLoading && styles.startButtonDisabled]}
          onPress={handleStart}
          disabled={isLoading}
          accessibilityLabel="Start voice session with Intentio"
          accessibilityRole="button">
          {isLoading ? (
            <ActivityIndicator color={Colors.textPrimary} size="small" />
          ) : (
            <>
              <Text style={styles.startButtonText}>Start Session</Text>
              <Text style={styles.startButtonSubtext}>Hold to speak or use auto-listen</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Hint */}
        <Text style={styles.hint}>
          Try saying: "Book a flight to London next Tuesday"
        </Text>
      </View>
    </SafeAreaView>
  );
}

const FEATURES = [
  {emoji: '⚡', text: 'Sub-650ms latency'},
  {emoji: '🆓', text: 'Free via Managed Mode'},
  {emoji: '🔌', text: 'Any API via MCP'},
  {emoji: '🔄', text: 'Manual Turn Control'},
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xl,
  },
  heroSection: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  orbEmoji: {
    fontSize: 72,
    marginBottom: Spacing.sm,
  },
  appName: {
    fontSize: Typography.sizeXXL,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -1,
  },
  tagline: {
    fontSize: Typography.sizeMD,
    color: Colors.accent,
    fontWeight: '600',
    fontStyle: 'italic',
  },
  subtitle: {
    fontSize: Typography.sizeSM,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginTop: Spacing.xs,
  },
  features: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    justifyContent: 'center',
  },
  featurePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.surfaceAlt,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  featureEmoji: {
    fontSize: 14,
  },
  featureText: {
    fontSize: Typography.sizeXS,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  startButton: {
    width: '100%',
    backgroundColor: Colors.accent,
    paddingVertical: Spacing.md + 4,
    paddingHorizontal: Spacing.xl,
    borderRadius: Radius.xl,
    alignItems: 'center',
    shadowColor: Colors.accent,
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
    gap: 4,
  },
  startButtonDisabled: {
    opacity: 0.6,
  },
  startButtonText: {
    color: Colors.background,
    fontSize: Typography.sizeLG,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  startButtonSubtext: {
    color: Colors.background,
    fontSize: Typography.sizeXS,
    opacity: 0.7,
  },
  hint: {
    color: Colors.textMuted,
    fontSize: Typography.sizeXS,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});
