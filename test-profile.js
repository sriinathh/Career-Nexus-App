// Test script to verify profile API
const API_URL = 'http://10.0.2.2:5000/api/auth';

async function testProfileAPI() {
  try {
    console.log('Testing Profile API...');

    // First, login to get a token
    const loginResponse = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    });

    if (!loginResponse.ok) {
      console.log('Login failed - creating test user first...');

      // Register a test user
      const registerResponse = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          confirmPassword: 'password123'
        })
      });

      if (!registerResponse.ok) {
        console.log('Registration failed:', await registerResponse.text());
        return;
      }

      console.log('Test user registered successfully');
    }

    // Now login
    const loginData = await loginResponse.json();
    const token = loginData.token;

    console.log('Login successful, token received');

    // Test profile endpoint
    const profileResponse = await fetch(`${API_URL}/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!profileResponse.ok) {
      console.log('Profile fetch failed:', await profileResponse.text());
      return;
    }

    const profileData = await profileResponse.json();
    console.log('Profile data:', JSON.stringify(profileData, null, 2));

  } catch (error) {
    console.error('Test failed:', error);
  }
}

testProfileAPI();