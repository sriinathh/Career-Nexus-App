import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function BrandingHeader() {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate icon continuously
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.15,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <LinearGradient
      colors={['#0F172A', '#1E293B']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.content}>
        <Animated.View
          style={{
            transform: [
              { scale: scaleAnim },
              {
                rotate: rotateAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '360deg'],
                }),
              },
            ],
          }}
        >
          <LinearGradient
            colors={['#FF6B6B', '#4ECDC4', '#FFE66D']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.iconGradient}
          >
            <MaterialCommunityIcons
              name="brain"
              size={56}
              color="white"
              style={styles.icon}
            />
          </LinearGradient>
        </Animated.View>

        <View style={styles.textContainer}>
          <LinearGradient
            colors={['#FF6B6B', '#7C3AED', '#4ECDC4']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.textGradient}
          >
            <Text style={styles.brandName}>CareerNexus</Text>
          </LinearGradient>
          <LinearGradient
            colors={['#4ECDC4', '#FFE66D', '#FF6B6B']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.textGradient}
          >
            <Text style={styles.brandSubtext}>AI</Text>
          </LinearGradient>
        </View>
      </View>

      <View style={styles.taglineContainer}>
        <LinearGradient
          colors={['#667EEA', '#764BA2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.taglineGradient}
        >
          <Text style={styles.tagline}>
            Your AI-Powered Career Guide
          </Text>
        </LinearGradient>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 28,
    paddingHorizontal: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  iconGradient: {
    width: 80,
    height: 80,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 12,
  },
  icon: {
    textAlign: 'center',
  },
  textContainer: {
    flex: 1,
    gap: 4,
  },
  textGradient: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  brandName: {
    fontSize: 32,
    fontWeight: '900',
    color: 'white',
    letterSpacing: -0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  brandSubtext: {
    fontSize: 24,
    fontWeight: '800',
    color: 'white',
    letterSpacing: 1.2,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  taglineContainer: {
    marginTop: 16,
    width: '100%',
  },
  taglineGradient: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'center',
  },
  tagline: {
    fontSize: 14,
    fontWeight: '700',
    color: 'white',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});
