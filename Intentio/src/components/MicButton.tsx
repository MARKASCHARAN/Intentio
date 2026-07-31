/**
 * MicButton — push-to-talk and toggle mic button with visual feedback.
 *
 * Supports desktop web mouse click, touch events, and hold-to-talk.
 */
import React, {useRef} from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Animated,
  View,
} from 'react-native';
import {Colors} from './styles';

interface MicButtonProps {
  onPressIn?: () => void;
  onPressOut?: () => void;
  onPress?: () => void;
  isActive?: boolean;
  isPushToTalk?: boolean;
  disabled?: boolean;
  size?: number;
}

export function MicButton({
  onPressIn,
  onPressOut,
  onPress,
  isActive = false,
  isPushToTalk = false,
  disabled = false,
  size = 72,
}: MicButtonProps): React.JSX.Element {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.92,
      useNativeDriver: false,
      friction: 5,
    }).start();
    onPressIn?.();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: false,
      friction: 5,
    }).start();
    onPressOut?.();
  };

  const handleClick = () => {
    onPress?.();
  };

  const backgroundColor = disabled
    ? Colors.surfaceBorder
    : isActive
    ? Colors.listening
    : Colors.accent;

  return (
    <Animated.View
      style={[styles.wrapper, {transform: [{scale: scaleAnim}]}]}>
      {/* Outer glow ring when active */}
      {isActive && (
        <View
          style={[
            styles.glowRing,
            {
              width: size + 24,
              height: size + 24,
              borderRadius: (size + 24) / 2,
            },
          ]}
        />
      )}

      <TouchableOpacity
        accessibilityLabel={
          isPushToTalk
            ? isActive
              ? 'Release to stop speaking'
              : 'Hold to speak'
            : isActive
            ? 'Mute microphone'
            : 'Unmute microphone'
        }
        accessibilityRole="button"
        accessibilityState={{disabled, selected: isActive}}
        disabled={disabled}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handleClick}
        activeOpacity={0.8}
        style={[
          styles.button,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor,
          },
        ]}>
        <Animated.Text style={styles.micEmoji}>
          {disabled ? '🚫' : isActive ? '🔴' : '🎙️'}
        </Animated.Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowRing: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: Colors.listening,
    opacity: 0.4,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.accent,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    cursor: 'pointer',
  },
  micEmoji: {
    fontSize: 28,
  },
});
