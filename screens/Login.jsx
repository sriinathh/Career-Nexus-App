import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Use Render backend URL
const API_URL = 'https://career-backend-p085.onrender.com/api/auth';
const FALLBACK_API_URL = 'https://career-backend-p085.onrender.com/api/auth';

const Login = ({ navigation }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');

  // Handle Login
  const handleLogin = async () => {
    if (!loginEmail.trim() || !loginPassword.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!loginEmail.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email');
      return;
    }

    if (loginPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      const email = loginEmail.trim();
      const password = loginPassword.trim();
      const requestBody = JSON.stringify({ email, password });
      
      console.log('📨 Attempting login:', email);
      console.log('🌐 Trying API URL:', `${API_URL}/login`);
      
      // Helper function to fetch with timeout
      const fetchWithTimeout = (url, options, timeout = 10000) => {
        return Promise.race([
          fetch(url, options),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Request timeout')), timeout)
          )
        ]);
      };
      
      let response;
      let usedUrl = API_URL;
      
      try {
        response = await fetchWithTimeout(`${API_URL}/login`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: requestBody,
        }, 5000);
      } catch (err) {
        console.log('⚠️ Primary URL failed:', err.message, 'Trying fallback:', `${FALLBACK_API_URL}/login`);
        usedUrl = FALLBACK_API_URL;
        response = await fetchWithTimeout(`${FALLBACK_API_URL}/login`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: requestBody,
        }, 5000);
      }

      console.log('✅ Response status:', response.status);
      console.log('✅ Used URL:', usedUrl);
      const data = await response.json();
      console.log('✅ Response data:', data);

      if (!response.ok) {
        Alert.alert('Login Failed', data.error || `Error: ${response.status}`);
        return;
      }

      if (data.token) {
        Alert.alert('Success', 'Login successful!');
        await AsyncStorage.setItem('userToken', data.token);
        await AsyncStorage.setItem('apiUrl', usedUrl);
        navigation?.navigate('MainApp', {
          screen: 'DashboardScreen',
          params: {
            token: data.token,
            user: data.user,
          }
        });
      } else {
        Alert.alert('Error', 'No token received from server');
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      console.error('   Error name:', error.name);
      console.error('   Error message:', error.message);
      Alert.alert('Error', `Network Error: ${error.message}\n\nMake sure backend is running:\n• http://10.0.2.2:5000 (Android emulator)\n• http://192.168.1.4:5000 (Host machine)`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Register
  const handleRegister = async () => {
    if (!registerName.trim() || !registerEmail.trim() || !registerPassword.trim() || !registerConfirmPassword.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!registerEmail.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email');
      return;
    }

    if (registerPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    if (registerPassword !== registerConfirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      console.log('📨 Attempting registration:', registerEmail);
      console.log('🌐 Trying API URL:', `${API_URL}/register`);
      
      const requestBody = JSON.stringify({
        name: registerName.trim(),
        email: registerEmail.trim(),
        password: registerPassword,
        confirmPassword: registerConfirmPassword,
      });

      // Helper function to fetch with timeout
      const fetchWithTimeout = (url, options, timeout = 10000) => {
        return Promise.race([
          fetch(url, options),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Request timeout')), timeout)
          )
        ]);
      };

      let response;
      let usedUrl = API_URL;
      
      try {
        response = await fetchWithTimeout(`${API_URL}/register`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: requestBody,
        }, 5000);
      } catch (err) {
        console.log('⚠️ Primary URL failed:', err.message, 'Trying fallback:', `${FALLBACK_API_URL}/register`);
        usedUrl = FALLBACK_API_URL;
        response = await fetchWithTimeout(`${FALLBACK_API_URL}/register`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: requestBody,
        }, 5000);
      }
      
      console.log('✅ Response status:', response.status);
      console.log('✅ Used URL:', usedUrl);
      const data = await response.json();
      console.log('✅ Response data:', data);

      if (!response.ok) {
        Alert.alert('Registration Failed', data.error || `Error: ${response.status}`);
        return;
      }

      Alert.alert('Success', 'Account created successfully!');
      await AsyncStorage.setItem('userToken', data.token);
      await AsyncStorage.setItem('apiUrl', usedUrl);
      navigation?.navigate('MainApp', {
        token: data.token,
        user: data.user,
      });
    } catch (error) {
      console.error('❌ Registration error:', error);
      if (error.name === 'AbortError') {
        Alert.alert('Error', 'Request timeout. Is backend running on port 5000?');
      } else {
        Alert.alert('Error', `Network Error: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FC" translucent={true} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.logo}>CareerNexus</Text>
            <TouchableOpacity style={styles.toggleBtn} onPress={() => setIsLoginMode(!isLoginMode)}>
              <Text style={styles.toggleBtnText}>{isLoginMode ? 'Register' : 'Login'}</Text>
            </TouchableOpacity>
          </View>

          {/* MAIN CARD */}
          <View style={styles.card}>
            {/* BANNER */}
            <LinearGradient colors={['#4F46E5', '#7C3AED']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.banner}>
              <Image
                source={{ uri: 'https://res.cloudinary.com/notes1/image/upload/White_Minimalist_Career_Growth_Instagram_Post_dtg4cw.png' }}
                style={styles.bannerImage}
                resizeMode="contain"
              />
              <Text style={styles.bannerTitle}>Your Career Journey</Text>
            </LinearGradient>

            {/* TITLE */}
            <Text style={styles.cardTitle}>{isLoginMode ? 'Welcome Back' : 'Join CareerNexus'}</Text>
            <Text style={styles.cardSubtitle}>{isLoginMode ? 'Sign in to continue' : 'Create your account'}</Text>

            {/* GOOGLE BUTTON */}
            <TouchableOpacity style={styles.googleBtn}>
              <MaterialCommunityIcons name="google" size={18} color="#4F46E5" style={styles.googleIcon} />
              <Text style={styles.googleBtnText}>Continue with Google</Text>
            </TouchableOpacity>

            {/* DIVIDER */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* FORMS */}
            {isLoginMode ? (
              // LOGIN FORM
              <View style={styles.formContent}>
                {/* EMAIL */}
                <View style={styles.inputGroup}>
                  <MaterialCommunityIcons name="email" size={20} color="#9CA3AF" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Email Address"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="email-address"
                    value={loginEmail}
                    onChangeText={setLoginEmail}
                    editable={!isLoading}
                    autoCorrect={false}
                    autoCapitalize="none"
                  />
                </View>

                {/* PASSWORD */}
                <View style={styles.inputGroup}>
                  <MaterialCommunityIcons name="lock" size={20} color="#9CA3AF" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry
                    value={loginPassword}
                    onChangeText={setLoginPassword}
                    editable={!isLoading}
                    autoCorrect={false}
                  />
                </View>

                {/* FORGOT PASSWORD */}
                <TouchableOpacity style={styles.forgotLink}>
                  <MaterialCommunityIcons name="help-circle-outline" size={14} color="#4F46E5" />
                  <Text style={styles.forgotText}>Forgot Password?</Text>
                </TouchableOpacity>

                {/* LOGIN BUTTON */}
                <TouchableOpacity style={[styles.primaryBtn, isLoading && styles.btnDisabled]} onPress={handleLogin} disabled={isLoading}>
                  {isLoading ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <LinearGradient colors={['#4F46E5', '#7C3AED']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.btnGradient}>
                      <Text style={styles.primaryBtnText}>Sign In</Text>
                    </LinearGradient>
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              // REGISTER FORM
              <View style={styles.formContent}>
                {/* NAME */}
                <View style={styles.inputGroup}>
                  <MaterialCommunityIcons name="account" size={20} color="#9CA3AF" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Full Name"
                    placeholderTextColor="#9CA3AF"
                    value={registerName}
                    onChangeText={setRegisterName}
                    editable={!isLoading}
                    autoCorrect={false}
                    autoCapitalize="words"
                  />
                </View>

                {/* EMAIL */}
                <View style={styles.inputGroup}>
                  <MaterialCommunityIcons name="email" size={20} color="#9CA3AF" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Email Address"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="email-address"
                    value={registerEmail}
                    onChangeText={setRegisterEmail}
                    editable={!isLoading}
                    autoCorrect={false}
                    autoCapitalize="none"
                  />
                </View>

                {/* PASSWORD */}
                <View style={styles.inputGroup}>
                  <MaterialCommunityIcons name="lock" size={20} color="#9CA3AF" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry
                    value={registerPassword}
                    onChangeText={setRegisterPassword}
                    editable={!isLoading}
                    autoCorrect={false}
                  />
                </View>

                {/* CONFIRM PASSWORD */}
                <View style={styles.inputGroup}>
                  <MaterialCommunityIcons name="check-circle" size={20} color="#9CA3AF" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm Password"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry
                    value={registerConfirmPassword}
                    onChangeText={setRegisterConfirmPassword}
                    editable={!isLoading}
                    autoCorrect={false}
                  />
                </View>

                {/* REGISTER BUTTON */}
                <TouchableOpacity style={[styles.primaryBtn, isLoading && styles.btnDisabled]} onPress={handleRegister} disabled={isLoading}>
                  {isLoading ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <LinearGradient colors={['#4F46E5', '#7C3AED']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.btnGradient}>
                      <Text style={styles.primaryBtnText}>Create Account</Text>
                    </LinearGradient>
                  )}
                </TouchableOpacity>
              </View>
            )}

            {/* FOOTER */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>{isLoginMode ? "Don't have an account? " : 'Already have an account? '}</Text>
              <TouchableOpacity onPress={() => setIsLoginMode(!isLoginMode)}>
                <Text style={styles.footerLink}>{isLoginMode ? 'Register' : 'Login'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* INFO SECTION */}
          <View style={styles.infoBox}>
            <View style={styles.infoBullet}>
              <MaterialCommunityIcons name="shield-check" size={18} color="#4F46E5" />
              <Text style={styles.infoText}>Secure & encrypted</Text>
            </View>
            <View style={styles.infoBullet}>
              <MaterialCommunityIcons name="robot" size={18} color="#4F46E5" />
              <Text style={styles.infoText}>AI-powered guidance</Text>
            </View>
            <View style={styles.infoBullet}>
              <MaterialCommunityIcons name="account-multiple" size={18} color="#4F46E5" />
              <Text style={styles.infoText}>Join 25K+ students</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FC' },
  flex: { flex: 1 },
  scrollContent: { paddingTop: Constants.statusBarHeight + 8, paddingBottom: 8, paddingHorizontal: 16, flexGrow: 1 },

  // HEADER
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  logo: { fontSize: 20, fontWeight: '700', color: '#4F46E5' },
  toggleBtn: { paddingHorizontal: 14, paddingVertical: 8, backgroundColor: 'rgba(79, 70, 229, 0.1)', borderRadius: 20, borderWidth: 1.5, borderColor: '#4F46E5' },
  toggleBtnText: { fontSize: 12, fontWeight: '600', color: '#4F46E5' },

  // CARD
  card: { backgroundColor: '#FFF', borderRadius: 24, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.08, shadowRadius: 20, elevation: 8, marginBottom: 12 },

  // BANNER
  banner: { paddingVertical: 20, paddingHorizontal: 24, justifyContent: 'center', alignItems: 'center' },
  bannerImage: { width: 100, height: 100, marginBottom: 6 },
  bannerTitle: { fontSize: 16, fontWeight: '700', color: '#FFF' },

  // TITLE
  cardTitle: { fontSize: 24, fontWeight: '700', color: '#1F2937', textAlign: 'center', marginTop: 20, marginBottom: 6 },
  cardSubtitle: { fontSize: 13, fontWeight: '500', color: '#6B7280', textAlign: 'center', marginBottom: 16, marginHorizontal: 24 },

  // GOOGLE BUTTON
  googleBtn: { marginHorizontal: 24, paddingVertical: 11, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderRadius: 12, borderWidth: 1.5, borderColor: '#E5E7EB', backgroundColor: '#FFF', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2, marginBottom: 14 },
  googleIcon: { marginRight: 8 },
  googleBtnText: { fontSize: 14, fontWeight: '600', color: '#1F2937' },

  // DIVIDER
  divider: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 24, marginVertical: 12 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#E5E7EB' },
  dividerText: { marginHorizontal: 12, fontSize: 12, fontWeight: '600', color: '#9CA3AF' },

  // FORM
  formContent: { paddingHorizontal: 24, marginBottom: 12 },
  inputGroup: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, marginBottom: 10, backgroundColor: '#F3F4F6', borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', minHeight: 46 },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 14, fontWeight: '500', color: '#1F2937', paddingVertical: 12, paddingHorizontal: 4 },

  // FORGOT PASSWORD
  forgotLink: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end', marginBottom: 12 },
  forgotText: { fontSize: 13, fontWeight: '600', color: '#4F46E5', marginLeft: 4 },

  // BUTTONS
  primaryBtn: { borderRadius: 12, overflow: 'hidden', marginBottom: 12 },
  btnGradient: { paddingVertical: 14, alignItems: 'center', justifyContent: 'center' },
  primaryBtnText: { fontSize: 16, fontWeight: '700', color: '#FFF' },
  btnDisabled: { opacity: 0.6 },

  // FOOTER
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#E5E7EB' },
  footerText: { fontSize: 13, fontWeight: '500', color: '#6B7280' },
  footerLink: { fontSize: 13, fontWeight: '700', color: '#4F46E5' },

  // INFO BOX
  infoBox: { paddingVertical: 12, paddingHorizontal: 16, backgroundColor: '#E0E7FF', borderRadius: 16, marginHorizontal: 16, marginBottom: 16 },
  infoBullet: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  infoText: { fontSize: 12, fontWeight: '500', color: '#1F2937', marginLeft: 10, flex: 1 },
});

export default Login;
