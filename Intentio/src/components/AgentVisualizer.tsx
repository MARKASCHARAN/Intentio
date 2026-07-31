/**
 * AgentVisualizer — Million-Dollar Animated AI Core Orb
 * Reflects real-time Agora v2.9 Agent state notifications (listening, thinking, speaking, idle).
 */
import React, {useEffect, useRef} from 'react';
import {View, Animated, StyleSheet, Easing} from 'react-native';
import {Colors} from './styles';
import type {AgentStateType} from '../types/agent';

interface AgentVisualizerProps {
  state: AgentStateType;
  size?: number;
}

const DEFAULT_ORB_SIZE = 110;

export function AgentVisualizer({
  state,
  size = DEFAULT_ORB_SIZE,
}: AgentVisualizerProps): React.JSX.Element {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const ring1Anim = useRef(new Animated.Value(0)).current;
  const ring2Anim = useRef(new Animated.Value(0)).current;
  const breatheAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    // Stop prior animations
    pulseAnim.stopAnimation();
    rotateAnim.stopAnimation();
    ring1Anim.stopAnimation();
    ring2Anim.stopAnimation();
    breatheAnim.stopAnimation();

    // Reset initial values
    pulseAnim.setValue(1);
    rotateAnim.setValue(0);
    ring1Anim.setValue(0);
    ring2Anim.setValue(0);
    breatheAnim.setValue(0.95);

    // Idle breathing loop
    if (state === 'idle') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(breatheAnim, {
            toValue: 1.05,
            duration: 1800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(breatheAnim, {
            toValue: 0.95,
            duration: 1800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else if (state === 'listening') {
      // Fast pulsing emerald green aura
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.28,
            duration: 550,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 550,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else if (state === 'thinking') {
      // Rotating neon amber arc spinner
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ).start();
    } else if (state === 'speaking') {
      // Expanding electric blue soundwave rings
      const createRing = (anim: Animated.Value, delay: number) =>
        Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.parallel([
              Animated.timing(anim, {
                toValue: 1,
                duration: 900,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
              }),
            ]),
            Animated.timing(anim, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true,
            }),
          ]),
        );
      createRing(ring1Anim, 0).start();
      createRing(ring2Anim, 450).start();
    }
  }, [state, pulseAnim, rotateAnim, ring1Anim, ring2Anim, breatheAnim]);

  const orbColor = {
    idle: Colors.accent,
    listening: Colors.listening,
    thinking: Colors.thinking,
    speaking: Colors.speaking,
  }[state];

  const orbGlow = {
    idle: 'rgba(0, 242, 254, 0.4)',
    listening: Colors.listeningGlow,
    thinking: Colors.thinkingGlow,
    speaking: Colors.speakingGlow,
  }[state];

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const ring1Scale = ring1Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 2.3],
  });
  const ring1Opacity = ring1Anim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.7, 0.3, 0],
  });
  const ring2Scale = ring2Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 2.3],
  });
  const ring2Opacity = ring2Anim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.7, 0.3, 0],
  });

  const currentScale =
    state === 'idle' ? breatheAnim : state === 'listening' ? pulseAnim : 1;

  return (
    <View style={[styles.container, {width: size * 2.6, height: size * 2.6}]}>
      {/* Outer ambient glow halo */}
      <View
        style={[
          styles.glowHalo,
          {
            width: size * 1.8,
            height: size * 1.8,
            borderRadius: (size * 1.8) / 2,
            backgroundColor: orbGlow,
          },
        ]}
      />

      {/* Speaking soundwave rings */}
      {state === 'speaking' && (
        <>
          <Animated.View
            style={[
              styles.ring,
              {
                width: size,
                height: size,
                borderRadius: size / 2,
                borderColor: Colors.speaking,
                transform: [{scale: ring1Scale}],
                opacity: ring1Opacity,
              },
            ]}
          />
          <Animated.View
            style={[
              styles.ring,
              {
                width: size,
                height: size,
                borderRadius: size / 2,
                borderColor: Colors.speaking,
                transform: [{scale: ring2Scale}],
                opacity: ring2Opacity,
              },
            ]}
          />
        </>
      )}

      {/* Thinking rotating arc */}
      {state === 'thinking' && (
        <Animated.View
          style={[
            styles.arcSpinner,
            {
              width: size + 22,
              height: size + 22,
              borderRadius: (size + 22) / 2,
              borderTopColor: Colors.thinking,
              borderRightColor: 'rgba(245, 158, 11, 0.4)',
              transform: [{rotate: rotation}],
            },
          ]}
        />
      )}

      {/* Core AI Orb */}
      <Animated.View
        style={[
          styles.orbCore,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: orbColor,
            shadowColor: orbColor,
            transform: [{scale: currentScale}],
          },
        ]}>
        {/* Core highlight reflection */}
        <View
          style={[
            styles.coreGlowReflection,
            {
              width: size * 0.45,
              height: size * 0.45,
              borderRadius: (size * 0.45) / 2,
            },
          ]}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  glowHalo: {
    position: 'absolute',
    opacity: 0.7,
  },
  orbCore: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.9,
    shadowRadius: 30,
    elevation: 15,
  },
  coreGlowReflection: {
    position: 'absolute',
    top: '15%',
    left: '18%',
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
  },
  ring: {
    position: 'absolute',
    borderWidth: 2,
  },
  arcSpinner: {
    position: 'absolute',
    borderWidth: 3.5,
    borderColor: 'transparent',
  },
});
