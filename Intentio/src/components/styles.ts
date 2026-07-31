/**
 * Intentio Design System — shared tokens for colors, typography, and spacing.
 * All components should import from here — no inline colors or magic numbers.
 */
import {StyleSheet} from 'react-native';

// ─── Color Palette ────────────────────────────────────────────────────────────
export const Colors = {
  // Backgrounds
  background: '#0A0A0F',      // Deep space black
  surface: '#13131A',         // Card / modal background
  surfaceAlt: '#1C1C28',      // Elevated surface (bottom sheet, etc.)
  surfaceBorder: '#2A2A3A',   // Subtle borders

  // Brand
  primary: '#1A237E',         // Deep blue (primary brand)
  accent: '#00BCD4',          // Teal (agent color)
  highlight: '#FF6F00',       // Amber (CTAs, important actions)

  // Agent State Colors (Agora v2.9 state notifications)
  listening: '#00E676',       // Vivid green
  listeningBg: 'rgba(0, 230, 118, 0.12)',
  thinking: '#FF9100',        // Vivid amber
  thinkingBg: 'rgba(255, 145, 0, 0.12)',
  speaking: '#448AFF',        // Electric blue
  speakingBg: 'rgba(68, 138, 255, 0.12)',
  idle: '#616161',            // Neutral grey

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#9E9E9E',
  textMuted: '#616161',

  // Semantic
  success: '#00E676',
  warning: '#FF9100',
  error: '#FF5252',
};

// ─── Typography ───────────────────────────────────────────────────────────────
export const Typography = {
  fontRegular: 400,
  fontMedium: 500,
  fontSemiBold: 600,
  fontBold: 700,

  sizeXXL: 36,
  sizeXL: 28,
  sizeLG: 22,
  sizeMD: 18,
  sizeBase: 16,
  sizeSM: 14,
  sizeXS: 12,
  sizeXXS: 10,
};

// ─── Spacing ──────────────────────────────────────────────────────────────────
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// ─── Border Radius ────────────────────────────────────────────────────────────
export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};

// ─── Shared Styles ────────────────────────────────────────────────────────────
export const SharedStyles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textPrimary: {
    color: Colors.textPrimary,
    fontSize: Typography.sizeBase,
  },
  textSecondary: {
    color: Colors.textSecondary,
    fontSize: Typography.sizeSM,
  },
  shadow: {
    shadowColor: Colors.accent,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
});
