/**
 * StateIndicator — text label that shows the current agent state.
 * Shown below the AgentVisualizer in ChatScreen.
 *
 * Agora v2.9: Driven by Agent State Notifications over RTM.
 */
import React from 'react';
import {Text, StyleSheet, Animated} from 'react-native';
import {Colors, Typography} from './styles';
import type {AgentStateType} from '../types/agent';

interface StateIndicatorProps {
  state: AgentStateType;
}

const STATE_CONFIG: Record<
  AgentStateType,
  {label: string; color: string; emoji: string}
> = {
  idle: {label: 'Idle', color: Colors.idle, emoji: '💤'},
  listening: {label: 'Listening...', color: Colors.listening, emoji: '🎙️'},
  thinking: {label: 'Thinking...', color: Colors.thinking, emoji: '🧠'},
  speaking: {label: 'Speaking...', color: Colors.speaking, emoji: '🔊'},
};

export function StateIndicator({state}: StateIndicatorProps): React.JSX.Element {
  const config = STATE_CONFIG[state];

  return (
    <Text style={[styles.label, {color: config.color}]}>
      {config.emoji}{'  '}{config.label}
    </Text>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: Typography.sizeSM,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginTop: 12,
  },
});
