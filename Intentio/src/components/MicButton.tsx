/**
 * MicButton — Million-Dollar Pulsing Neon Microphone Control Button
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
  size = 76,
}: MicButtonProps): React.JSX.Element {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.9,
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

  const shadowColor = isActive ? Colors.listening : Colors.accent;

  return (
    <Animated.View
      style={[styles.wrapper, {transform: [{scale: scaleAnim}]}]}>
      {/* Outer ambient glow halo */}
      <View
        style={[
          styles.glowHalo,
          {
            width: size + 28,
            height: size + 28,
            borderRadius: (size + 28) / 2,
            backgroundColor: isActive ? Colors.listeningGlow : 'rgba(0, 242, 254, 0.25)',
          },
        ]}
      />

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
        activeOpacity={0.85}
        style={[
          styles.button,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor,
            shadowColor,
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
    position: 'relative',
  },
  glowHalo: {
    position: 'absolute',
    borderWidth: 1.5,
    borderColor: 'rgba(0, 242, 254, 0.4)',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.95,
    shadowRadius: 20,
    elevation: 12,
  },
  micEmoji: {
    fontSize: 30,
  },
});
