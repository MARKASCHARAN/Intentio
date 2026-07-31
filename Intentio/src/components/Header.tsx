/**
 * Header — Million-Dollar Glassmorphic Navigation Header
 */
import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Colors, Typography, Spacing, Radius} from './styles';
import type {AgoraConnectionState} from '../types/rtc';

interface HeaderProps {
  title?: string;
  connectionState?: AgoraConnectionState;
  onSettingsPress?: () => void;
  onUnmutePress?: () => void;
  showBack?: boolean;
  onBackPress?: () => void;
}

const CONNECTION_CONFIG: Record<
  AgoraConnectionState,
  {dot: string; label: string}
> = {
  CONNECTED: {dot: Colors.success, label: 'Live • Connected'},
  CONNECTING: {dot: Colors.warning, label: 'Connecting...'},
  RECONNECTING: {dot: Colors.warning, label: 'Reconnecting...'},
  DISCONNECTED: {dot: Colors.error, label: 'Disconnected'},
  FAILED: {dot: Colors.error, label: 'Failed'},
};

export function Header({
  title = 'Intentio',
  connectionState,
  onSettingsPress,
  onUnmutePress,
  showBack = false,
  onBackPress,
}: HeaderProps): React.JSX.Element {
  const connConfig = connectionState
    ? CONNECTION_CONFIG[connectionState]
    : null;

  return (
    <View style={styles.container}>
      {/* Left side */}
      <View style={styles.side}>
        {showBack && onBackPress ? (
          <TouchableOpacity onPress={onBackPress} style={styles.iconBtn}
            accessibilityLabel="Go back" accessibilityRole="button">
            <Text style={styles.iconText}>←</Text>
          </TouchableOpacity>
        ) : onUnmutePress ? (
          <TouchableOpacity onPress={onUnmutePress} style={styles.iconBtn}
            accessibilityLabel="Unmute audio" accessibilityRole="button">
            <Text style={styles.iconText}>🔊</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Center title & status pill */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
        {connConfig ? (
          <TouchableOpacity
            style={styles.statusPill}
            onPress={onUnmutePress}
            activeOpacity={0.7}>
            <View style={[styles.dot, {backgroundColor: connConfig.dot}]} />
            <Text style={styles.statusText}>{connConfig.label}</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Right side */}
      <View style={styles.side}>
        {onSettingsPress ? (
          <TouchableOpacity
            onPress={onSettingsPress}
            style={styles.iconBtn}
            accessibilityLabel="Settings"
            accessibilityRole="button">
            <Text style={styles.iconText}>⚙️</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: 'rgba(3, 7, 18, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceBorder,
  },
  side: {
    width: 48,
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: Typography.sizeMD,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    color: Colors.textSecondary,
    fontSize: Typography.sizeXXS,
    fontWeight: '600',
  },
  iconBtn: {
    padding: Spacing.xs,
  },
  iconText: {
    fontSize: 18,
  },
});
