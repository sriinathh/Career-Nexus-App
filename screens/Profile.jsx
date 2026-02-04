import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  StatusBar,
  ActivityIndicator,
  Image,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import * as ImagePicker from 'expo-image-picker';
import { Card, CustomButton } from '../components/CommonComponents';
import AppHeader from '../components/AppHeader';

export default function Profile({ navigation, route }) {
  const [user, setUser] = useState(route?.params?.user || {});
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [apiBaseUrl, setApiBaseUrl] = useState('http://10.0.2.2:5000');

  const API_URL = 'https://career-backend-p085.onrender.com/api/auth';
  const FALLBACK_API_URL = 'https://career-backend-p085.onrender.com/api/auth';

  useEffect(() => {
    // Load saved API URL to get correct base URL
    const loadApiUrl = async () => {
      const savedUrl = await AsyncStorage.getItem('apiUrl');
      if (savedUrl) {
        const baseUrl = savedUrl.replace('/api/auth', '');
        setApiBaseUrl(baseUrl);
      }
    };
    loadApiUrl();
    
    // Show cached user data first if available
    const cachedUser = route?.params?.user;
    if (cachedUser && cachedUser.name) {
      setUser(cachedUser);
      setLoading(false);
    }
    // Fetch fresh data in background
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setFetching(true);
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        setLoading(false);
        return;
      }

      // Helper function to fetch with timeout
      const fetchWithTimeout = (url, options, timeout = 3000) => {
        return Promise.race([
          fetch(url, options),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Request timeout')), timeout)
          )
        ]);
      };

      let response;
      try {
        response = await fetchWithTimeout(`${API_URL}/profile`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      } catch (err) {
        console.log('⚠️ Primary URL failed, trying fallback');
        response = await fetchWithTimeout(`${FALLBACK_API_URL}/profile`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }, 3000);
      }

      if (!response.ok) {
        setLoading(false);
        return;
      }

      const data = await response.json();
      setUser(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setLoading(false);
    } finally {
      setFetching(false);
    }
  };

  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.granted === false) {
        Alert.alert('Permission required', 'Permission to access camera roll is required!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
        base64: true,
      });

      if (!result.canceled && result.assets[0].base64) {
        console.log('🖼️ Image selected with base64');
        await uploadImage(result.assets[0]);
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to pick image: ' + error.message);
    }
  };

  const uploadImage = async (imageAsset) => {
    try {
      setUploading(true);
      console.log('📸 Starting image upload...');
      
      const token = await AsyncStorage.getItem('userToken');
      const savedApiUrl = await AsyncStorage.getItem('apiUrl');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      if (!imageAsset.base64) {
        throw new Error('Image base64 data not available');
      }

      console.log('✅ Base64 data ready, size:', imageAsset.base64.length);

      // Use saved API URL or fallback
      const uploadUrl = savedApiUrl || API_URL;
      const uploadEndpoint = uploadUrl.includes('/api/auth') 
        ? uploadUrl + '/upload-profile-image'
        : uploadUrl + '/api/auth/upload-profile-image';

      console.log('📤 Uploading to:', uploadEndpoint);

      const response = await fetch(uploadEndpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: imageAsset.base64,
          filename: `profile_${Date.now()}.jpg`,
          type: 'image/jpeg',
        }),
      });

      console.log('📬 Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('   Error response:', errorText);
        let errorMessage = 'Server error: ' + response.status;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorText;
        } catch (e) {
          errorMessage = errorText || 'Unknown error';
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('✅ Upload successful:', result.imageUrl);
      console.log('   Full image URL:', `${apiBaseUrl}${result.imageUrl}`);
      
      // Update user state with new image immediately
      setUser(prev => ({ ...prev, profile_image: result.imageUrl }));
      
      Alert.alert('Success', 'Profile image updated successfully!');
      
      // Refresh profile to get latest data from server
      setTimeout(() => {
        fetchUserProfile();
      }, 1000);
    } catch (error) {
      console.error('❌ Upload error:', error.message);
      Alert.alert('Upload Failed', error.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', onPress: () => {} },
        {
          text: 'Logout',
          onPress: () => {
            setLoading(true);
            setTimeout(() => {
              setLoading(false);
              navigation.navigate('Landing', { screen: 'LandingScreen' });
            }, 500);
          },
          style: 'destructive',
        },
      ]
    );
  };

  const InfoField = ({ icon, label, value, editable = false }) => (
    <Card style={styles.infoCard}>
      <View style={styles.infoContent}>
        <View style={styles.infoLeft}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name={icon} size={20} color="#4F46E5" />
          </View>
          <View style={styles.infoText}>
            <Text style={styles.infoLabel}>{label}</Text>
            <Text style={styles.infoValue}>{value || 'Not set'}</Text>
          </View>
        </View>
        {editable && (
          <MaterialCommunityIcons name="pencil" size={18} color="#9CA3AF" />
        )}
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor="#4F46E5" translucent={true} />
      <AppHeader
        title="Profile"
        showBackButton
        onBackPress={() => navigation.goBack()}
      />

      <TouchableOpacity style={styles.refreshButton} onPress={fetchUserProfile} disabled={fetching}>
        <MaterialCommunityIcons name="refresh" size={20} color="#4F46E5" />
        <Text style={styles.refreshText}>Refresh</Text>
      </TouchableOpacity>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Profile Header */}
          <View style={styles.profileHeader}>
            <TouchableOpacity style={styles.avatarContainer} onPress={pickImage} disabled={uploading}>
              {user?.profile_image ? (
                <Image 
                  source={{ uri: `${apiBaseUrl}${user.profile_image}` }} 
                  style={styles.avatarImage} 
                />
              ) : (
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </Text>
                </View>
              )}
              {uploading && (
                <View style={styles.uploadingOverlay}>
                  <ActivityIndicator size="small" color="white" />
                </View>
              )}
              <View style={styles.editIcon}>
                <MaterialCommunityIcons name="camera" size={16} color="white" />
              </View>
            </TouchableOpacity>
            <Text style={styles.profileName}>{user?.name || 'User'}</Text>
            <Text style={styles.profileEmail}>{user?.email || 'user@example.com'}</Text>
          </View>

          {/* Personal Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            <InfoField
              icon="account"
              label="Full Name"
              value={user?.name}
            />
            <InfoField
              icon="email"
              label="Email Address"
              value={user?.email}
            />
          </View>

          {/* Skills */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            {user?.skills && user.skills.length > 0 ? (
              <Card style={styles.skillsCard}>
                <View style={styles.skillsContainer}>
                  {user.skills.map((skill, index) => (
                    <View key={index} style={styles.skillTag}>
                      <Text style={styles.skillText}>{skill}</Text>
                    </View>
                  ))}
                </View>
              </Card>
            ) : (
              <Card style={styles.emptyState}>
                <View style={styles.emptyStateContent}>
                  <MaterialCommunityIcons name="brain" size={40} color="#D1D5DB" />
                  <Text style={styles.emptyStateText}>
                    Complete skill assessment to see your skills
                  </Text>
                  <TouchableOpacity
                    style={styles.assessmentLink}
                    onPress={() => navigation.navigate('Dashboard')}
                  >
                    <Text style={styles.assessmentLinkText}>Go to Assessment →</Text>
                  </TouchableOpacity>
                </View>
              </Card>
            )}
          </View>

          {/* Interests */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Interests</Text>
            <Card style={styles.emptyState}>
              <View style={styles.emptyStateContent}>
                <MaterialCommunityIcons name="heart" size={40} color="#D1D5DB" />
                <Text style={styles.emptyStateText}>
                  Complete interest analysis to see your interests
                </Text>
                <TouchableOpacity
                  style={styles.assessmentLink}
                  onPress={() => navigation.navigate('Dashboard')}
                >
                  <Text style={styles.assessmentLinkText}>Go to Analysis →</Text>
                </TouchableOpacity>
              </View>
            </Card>
          </View>

          {/* Account Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account</Text>
            <Card style={styles.settingCard}>
              <View style={styles.settingContent}>
                <MaterialCommunityIcons name="shield-account" size={20} color="#4F46E5" />
                <Text style={styles.settingText}>Privacy & Security</Text>
                <MaterialCommunityIcons name="chevron-right" size={20} color="#D1D5DB" />
              </View>
            </Card>
            <Card style={styles.settingCard}>
              <View style={styles.settingContent}>
                <MaterialCommunityIcons name="bell" size={20} color="#4F46E5" />
                <Text style={styles.settingText}>Notifications</Text>
                <MaterialCommunityIcons name="chevron-right" size={20} color="#D1D5DB" />
              </View>
            </Card>
          </View>

          {/* Logout Button */}
          <View style={styles.logoutSection}>
            <CustomButton
              title={loading ? 'Logging out...' : 'Logout'}
              onPress={handleLogout}
              loading={loading}
              disabled={loading}
              variant="danger"
              icon="logout"
            />
            <Text style={styles.logoutNote}>
              You can log back in anytime with your email and password
            </Text>
          </View>

          <View style={styles.bottomPadding} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#6B7280',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  infoCard: {
    marginVertical: 6,
  },
  infoContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoText: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  emptyState: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  emptyStateContent: {
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 12,
    marginBottom: 12,
    textAlign: 'center',
  },
  assessmentLink: {
    marginTop: 8,
  },
  assessmentLinkText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4F46E5',
  },
  settingCard: {
    marginVertical: 6,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1F2937',
    marginLeft: 12,
    flex: 1,
  },
  logoutSection: {
    marginBottom: 16,
  },
  logoutNote: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 12,
    textAlign: 'center',
  },
  bottomPadding: {
    height: 12,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 16,
    marginTop: 8,
    backgroundColor: '#EEF2FF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#4F46E5',
  },
  refreshText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4F46E5',
    marginLeft: 4,
  },
  // Profile Picture Styles
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#4F46E5',
  },
  uploadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
});
