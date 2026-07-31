/**
 * HomeScreen — Million-Dollar Hero Landing Experience
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
  Platform,
} from 'react-native';
import {Colors, Typography, Spacing, Radius, SharedStyles} from '../components/styles';
import {AgentVisualizer} from '../components/AgentVisualizer';
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
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        try {
          const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
          if (AudioCtx) {
            const ctx = new AudioCtx();
            if (ctx.state === 'suspended') {
              await ctx.resume();
            }
          }
        } catch (e) {}
      }

      const localUid = Math.floor(Math.random() * 100000) + 1;
      const tokenData = await fetchToken(CHANNEL_NAME, localUid);

      // Start Agent FIRST so Agent is already broadcasting when user joins
      await startAgent(CHANNEL_NAME, String(localUid), tokenData.token);
      await onSessionStart(tokenData.token, localUid);
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
        {/* Top Tech Badge */}
        <View style={styles.techBadge}>
          <Text style={styles.techBadgeDot}>🟢</Text>
          <Text style={styles.techBadgeText}>AGORA v2.9 CONVERSATIONAL ENGINE</Text>
        </View>

        {/* Hero Orb Visualizer */}
        <View style={styles.orbHeroContainer}>
          <AgentVisualizer state="idle" size={100} />
        </View>

        {/* Brand Title & Subtitle */}
        <View style={styles.heroHeader}>
          <Text style={styles.brandTitle}>Intentio</Text>
          <Text style={styles.brandTagline}>Speak your intent. We act.</Text>
          <Text style={styles.brandSubtitle}>
            Autonomous voice agent replacing app navigation with multi-turn intent execution.
          </Text>
        </View>

        {/* Feature Grid */}
        <View style={styles.featuresGrid}>
          {FEATURES.map(f => (
            <View key={f.text} style={styles.featureCard}>
              <Text style={styles.featureEmoji}>{f.emoji}</Text>
              <Text style={styles.featureText}>{f.text}</Text>
            </View>
          ))}
        </View>

        {/* Million-Dollar Start CTA Button */}
        <TouchableOpacity
          style={[styles.startCtaButton, isLoading && styles.startCtaDisabled]}
          onPress={handleStart}
          disabled={isLoading}
          activeOpacity={0.8}
          accessibilityLabel="Start voice session with Intentio"
          accessibilityRole="button">
          {isLoading ? (
            <ActivityIndicator color="#030712" size="small" />
          ) : (
            <>
              <Text style={styles.startCtaText}>Start Voice Session 🎙️</Text>
              <Text style={styles.startCtaSubtext}>Sub-650ms low latency • Powered by GPT-4o</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Spoken Intent Hint */}
        <Text style={styles.intentHint}>
          💡 Try saying: <Text style={styles.intentHintHighlight}>"Book a flight for London tomorrow night"</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

const FEATURES = [
  {emoji: '⚡', text: 'Sub-650ms Real-Time Voice'},
  {emoji: '🆓', text: 'Free Managed Mode ASR+LLM+TTS'},
  {emoji: '🔌', text: 'MCP External Tool Protocol'},
  {emoji: '📡', text: 'Agora RTM State Notifications'},
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.lg,
  },
  techBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(0, 242, 254, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 254, 0.3)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
  },
  techBadgeDot: {
    fontSize: 8,
  },
  techBadgeText: {
    color: Colors.accent,
    fontSize: Typography.sizeXXS,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  orbHeroContainer: {
    marginVertical: Spacing.xs,
  },
  heroHeader: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  brandTitle: {
    fontSize: 48,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -1.5,
  },
  brandTagline: {
    fontSize: Typography.sizeMD,
    color: Colors.accent,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  brandSubtitle: {
    fontSize: Typography.sizeSM,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 340,
    marginTop: 4,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    justifyContent: 'center',
    maxWidth: 380,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
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
  startCtaButton: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: Colors.accent,
    paddingVertical: Spacing.md + 2,
    paddingHorizontal: Spacing.xl,
    borderRadius: Radius.xl,
    alignItems: 'center',
    gap: 4,
    shadowColor: Colors.accent,
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 12,
  },
  startCtaDisabled: {
    opacity: 0.6,
  },
  startCtaText: {
    color: '#030712',
    fontSize: Typography.sizeLG - 2,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  startCtaSubtext: {
    color: '#030712',
    fontSize: Typography.sizeXS - 1,
    fontWeight: '600',
    opacity: 0.8,
  },
  intentHint: {
    color: Colors.textMuted,
    fontSize: Typography.sizeXS,
    textAlign: 'center',
  },
  intentHintHighlight: {
    color: Colors.accent,
    fontWeight: '600',
  },
});
