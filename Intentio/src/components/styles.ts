/**
 * Intentio Design System — Million-Dollar Ultra-Premium Aesthetic Tokens
 * Glassmorphism, Neon Glows, Rich Gradients & Modern Typography
 */
import {StyleSheet, Platform} from 'react-native';

// ─── Color Palette ────────────────────────────────────────────────────────────
export const Colors = {
  // Deep Space Backgrounds
  background: '#030712',        // Obsidian black
  surface: '#0B0F19',           // Dark glass surface
  surfaceAlt: '#111827',        // Elevated dark surface
  surfaceBorder: '#1F2937',     // Crisp dark border
  glassBorder: 'rgba(0, 242, 254, 0.2)', // Neon cyan subtle border

  // Brand Neon Gradients & Highlights
  primary: '#00F2FE',           // Electric Neon Cyan
  primaryLight: '#38EF7D',      // Bright Emerald Neon
  secondary: '#7928CA',         // Neon Purple
  accent: '#00F2FE',            // Vibrant Cyan Accent
  highlight: '#FF007A',         // Neon Magenta Accent

  // Agent State Colors (Agora v2.9 state notifications)
  listening: '#10B981',         // Emerald Green
  listeningGlow: 'rgba(16, 185, 129, 0.35)',
  thinking: '#F59E0B',          // Vivid Amber
  thinkingGlow: 'rgba(245, 158, 11, 0.35)',
  speaking: '#3B82F6',          // Electric Blue
  speakingGlow: 'rgba(59, 130, 246, 0.35)',
  idle: '#6B7280',              // Metallic Slate Grey

  // Text Hierarchy
  textPrimary: '#F9FAFB',
  textSecondary: '#9CA3AF',
  textMuted: '#4B5563',

  // Semantic
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
};

// ─── Typography ───────────────────────────────────────────────────────────────
export const Typography = {
  fontRegular: '400',
  fontMedium: '500',
  fontSemiBold: '600',
  fontBold: '700',
  fontExtraBold: '800',

  sizeXXL: 38,
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
  xs: 6,
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// ─── Border Radius ────────────────────────────────────────────────────────────
export const Radius = {
  sm: 10,
  md: 14,
  lg: 20,
  xl: 28,
  full: 9999,
};

// ─── Shared Styles ────────────────────────────────────────────────────────────
export const SharedStyles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  glassCard: {
    backgroundColor: 'rgba(17, 24, 39, 0.75)',
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 8,
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
    fontWeight: '500',
  },
  textSecondary: {
    color: Colors.textSecondary,
    fontSize: Typography.sizeSM,
  },
  neonGlow: {
    shadowColor: Colors.accent,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.8,
    shadowRadius: 16,
    elevation: 12,
  },
});
