/**
 * AgentVisualizer — animated orb that reflects the real-time agent state.
 *
 * Agora v2.9 Feature: Driven by Agent State Notifications over RTM.
 *
 * States:
 * - idle:      Static grey orb
 * - listening: Green pulsing ring (800ms loop)
 * - thinking:  Amber rotating arc spinner
 * - speaking:  Blue expanding concentric rings (400ms interval)
 */
import React, {useEffect, useRef} from 'react';
import {View, Animated, StyleSheet, Easing} from 'react-native';
import {Colors, Radius} from './styles';
import type {AgentStateType} from '../types/agent';

interface AgentVisualizerProps {
  state: AgentStateType;
  size?: number;
}

const ORB_SIZE = 96;

export function AgentVisualizer({
  state,
  size = ORB_SIZE,
}: AgentVisualizerProps): React.JSX.Element {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const ring1Anim = useRef(new Animated.Value(0)).current;
  const ring2Anim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Stop all animations when state changes
    pulseAnim.stopAnimation();
    rotateAnim.stopAnimation();
    ring1Anim.stopAnimation();
    ring2Anim.stopAnimation();

    // Reset values
    pulseAnim.setValue(1);
    rotateAnim.setValue(0);
    ring1Anim.setValue(0);
    ring2Anim.setValue(0);

    if (state === 'listening') {
      // Pulsing ring animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.3,
            duration: 600,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 600,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else if (state === 'thinking') {
      // Rotating arc
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1200,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ).start();
    } else if (state === 'speaking') {
      // Expanding rings
      const createRingLoop = (anim: Animated.Value, delay: number) =>
        Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.parallel([
              Animated.timing(anim, {
                toValue: 1,
                duration: 800,
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
      createRingLoop(ring1Anim, 0).start();
      createRingLoop(ring2Anim, 400).start();
    }
  }, [state, pulseAnim, rotateAnim, ring1Anim, ring2Anim, opacityAnim]);

  const orbColor = {
    idle: Colors.idle,
    listening: Colors.listening,
    thinking: Colors.thinking,
    speaking: Colors.speaking,
  }[state];

  const orbGlow = {
    idle: 'transparent',
    listening: Colors.listeningBg,
    thinking: Colors.thinkingBg,
    speaking: Colors.speakingBg,
  }[state];

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const ring1Scale = ring1Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 2.2],
  });
  const ring1Opacity = ring1Anim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.6, 0.3, 0],
  });
  const ring2Scale = ring2Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 2.2],
  });
  const ring2Opacity = ring2Anim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.6, 0.3, 0],
  });

  return (
    <View style={[styles.container, {width: size * 2.5, height: size * 2.5}]}>
      {/* Speaking rings */}
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

      {/* Thinking arc */}
      {state === 'thinking' && (
        <Animated.View
          style={[
            styles.arc,
            {
              width: size + 16,
              height: size + 16,
              borderRadius: (size + 16) / 2,
              borderTopColor: Colors.thinking,
              transform: [{rotate: rotation}],
            },
          ]}
        />
      )}

      {/* Core orb */}
      <Animated.View
        style={[
          styles.orb,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: orbColor,
            shadowColor: orbColor,
            transform: [{scale: state === 'listening' ? pulseAnim : 1}],
          },
        ]}>
        {/* Inner glow */}
        <View
          style={[
            styles.innerGlow,
            {
              width: size * 0.6,
              height: size * 0.6,
              borderRadius: (size * 0.6) / 2,
              backgroundColor: 'rgba(255,255,255,0.15)',
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
  },
  orb: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10,
  },
  innerGlow: {
    position: 'absolute',
    top: '20%',
    left: '20%',
  },
  ring: {
    position: 'absolute',
    borderWidth: 2,
  },
  arc: {
    position: 'absolute',
    borderWidth: 3,
    borderColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },
});
