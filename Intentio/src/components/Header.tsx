/**
 * Header — app bar with Intentio brand name and connection status indicator.
 */
import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Colors, Typography, Spacing} from './styles';
import type {AgoraConnectionState} from '../types/rtc';

interface HeaderProps {
  title?: string;
  connectionState?: AgoraConnectionState;
  onSettingsPress?: () => void;
  showBack?: boolean;
  onBackPress?: () => void;
}

const CONNECTION_CONFIG: Record<
  AgoraConnectionState,
  {dot: string; label: string}
> = {
  CONNECTED: {dot: Colors.success, label: 'Connected'},
  CONNECTING: {dot: Colors.warning, label: 'Connecting...'},
  RECONNECTING: {dot: Colors.warning, label: 'Reconnecting...'},
  DISCONNECTED: {dot: Colors.error, label: 'Disconnected'},
  FAILED: {dot: Colors.error, label: 'Failed'},
};

export function Header({
  title = 'Intentio',
  connectionState,
  onSettingsPress,
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
        ) : null}
      </View>

      {/* Center title */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
        {connConfig ? (
          <View style={styles.statusRow}>
            <View style={[styles.dot, {backgroundColor: connConfig.dot}]} />
            <Text style={styles.statusText}>{connConfig.label}</Text>
          </View>
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
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.surface,
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
  },
  title: {
    color: Colors.textPrimary,
    fontSize: Typography.sizeMD,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    color: Colors.textSecondary,
    fontSize: Typography.sizeXS,
  },
  iconBtn: {
    padding: Spacing.xs,
  },
  iconText: {
    fontSize: 20,
  },
});
