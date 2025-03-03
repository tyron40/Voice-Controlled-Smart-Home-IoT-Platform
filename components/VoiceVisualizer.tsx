import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withRepeat, 
  withSequence,
  Easing,
  cancelAnimation
} from 'react-native-reanimated';

type VoiceVisualizerProps = {
  isActive: boolean;
  barCount?: number;
  activeColor?: string;
  inactiveColor?: string;
  intensity?: number; // 0-1 value representing voice intensity
};

export default function VoiceVisualizer({
  isActive,
  barCount = 5,
  activeColor = '#007AFF',
  inactiveColor = '#D1D1D6',
  intensity = 0.5
}: VoiceVisualizerProps) {
  // Create an array of shared values for each bar
  const barHeights = Array.from({ length: barCount }, () => useSharedValue(10));
  
  useEffect(() => {
    if (isActive) {
      // Animate each bar with a different sequence and timing
      barHeights.forEach((height, index) => {
        const delay = index * 100; // Stagger the animations
        const maxHeight = 30 + (intensity * 30); // Scale max height based on intensity
        
        setTimeout(() => {
          height.value = withRepeat(
            withSequence(
              withTiming(maxHeight + Math.random() * 20, { 
                duration: 500 + Math.random() * 500,
                easing: Easing.inOut(Easing.ease)
              }),
              withTiming(10, { 
                duration: 500 + Math.random() * 500,
                easing: Easing.inOut(Easing.ease)
              })
            ),
            -1, // Infinite repeat
            true // Reverse
          );
        }, delay);
      });
    } else {
      // Reset all bars when inactive
      barHeights.forEach(height => {
        cancelAnimation(height);
        height.value = withTiming(10, { duration: 300 });
      });
    }
    
    return () => {
      // Clean up animations
      barHeights.forEach(height => {
        cancelAnimation(height);
      });
    };
  }, [isActive, intensity, barHeights]);
  
  // Create animated styles for each bar
  const animatedStyles = barHeights.map(height => 
    useAnimatedStyle(() => ({
      height: height.value,
      backgroundColor: isActive ? activeColor : inactiveColor,
    }))
  );
  
  return (
    <View style={styles.container}>
      {animatedStyles.map((style, index) => (
        <Animated.View 
          key={index} 
          style={[styles.bar, style]} 
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  bar: {
    width: 4,
    borderRadius: 2,
    marginHorizontal: 3,
  },
});