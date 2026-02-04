import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AppHeader({ title, showBackButton, onBackPress, showProfileButton, onProfilePress, user }) {
  const [apiUrl, setApiUrl] = useState('http://10.0.2.2:5000');
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loadApiUrl = async () => {
      try {
        const savedUrl = await AsyncStorage.getItem('apiUrl');
        if (savedUrl) {
          setApiUrl(savedUrl);
        }
      } catch (error) {
        console.error('Error loading API URL:', error);
      }
    };
    loadApiUrl();

    // Animate icon continuously
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const getProfileImageUri = () => {
    if (!user?.profile_image) return null;
    // Remove /api/auth from the URL to get base URL
    const baseUrl = apiUrl.replace('/api/auth', '');
    return `${baseUrl}${user.profile_image}`;
  };
  return (
    <LinearGradient
      colors={['#4F46E5', '#7C3AED']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.left}>
          {showBackButton ? (
            <TouchableOpacity onPress={onBackPress} style={styles.iconButton}>
              <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
            </TouchableOpacity>
          ) : (
            <View style={styles.brandContainer}>
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
                  <MaterialCommunityIcons name="brain" size={20} color="white" style={styles.brandIcon} />
                </LinearGradient>
              </Animated.View>
              <LinearGradient
                colors={['#FF6B6B', '#7C3AED', '#4ECDC4']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.brandTextGradient}
              >
                <Text style={styles.brandText}>CareerNexus AI</Text>
              </LinearGradient>
            </View>
          )}
        </View>

        <View style={styles.center}>
          <Text style={styles.title}>{title}</Text>
        </View>

        <View style={styles.right}>
          {showProfileButton && (
            <TouchableOpacity onPress={onProfilePress} style={styles.profileButton}>
              <View style={styles.avatarContainer}>
                {getProfileImageUri() ? (
                  <Image 
                    source={{ uri: getProfileImageUri() }} 
                    style={styles.avatarImage} 
                  />
                ) : (
                  <Text style={styles.avatarText}>
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight + 12,
    paddingBottom: 12,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: {
    minWidth: 120,
    alignItems: 'flex-start',
  },
  center: {
    flex: 1,
    alignItems: 'center',
  },
  right: {
    width: 40,
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  iconButton: {
    padding: 8,
  },
  profileButton: {
    padding: 4,
  },
  avatarContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  avatarImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconGradient: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  brandIcon: {
    marginTop: 0,
  },
  brandTextGradient: {
    paddingHorizontal: 4,
    borderRadius: 8,
  },
  brandText: {
    fontSize: 15,
    fontWeight: '800',
    color: 'white',
    letterSpacing: 0.8,
    paddingVertical: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
});
