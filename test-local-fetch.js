// Test script to verify local fetching functionality
// This script tests the API endpoints that the web app uses

const API_BASE_URL = 'http://localhost:3001/api';

// Test function to verify the verify-token endpoint
async function testVerifyToken() {
  console.log('🧪 Testing verify-token endpoint...');
  
  try {
    const response = await fetch(`${API_BASE_URL}/auth/verify-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token-123' // Test token
      }
    });

    console.log('Response status:', response.status);
    
    if (response.status === 401) {
      console.log('✅ Expected: 401 Unauthorized for invalid token');
    } else {
      const data = await response.json();
      console.log('Response data:', data);
    }
  } catch (error) {
    console.log('❌ Network error:', error.message);
    console.log('Make sure the web-server is running on localhost:3001');
  }
}

// Test function to verify API base URL
async function testApiConnection() {
  console.log('🧪 Testing API connection...');
  
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    console.log('Health check status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API is running:', data);
    } else {
      console.log('❌ API health check failed');
    }
  } catch (error) {
    console.log('❌ Cannot connect to API:', error.message);
    console.log('Make sure the web-server is running on localhost:3001');
  }
}

// Test function to simulate user login and token verification
async function testUserFlow() {
  console.log('🧪 Testing user flow...');
  
  try {
    // First, try to login with test credentials
    const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'testpassword'
      })
    });

    console.log('Login response status:', loginResponse.status);
    
    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('✅ Login successful:', loginData);
      
      // Now test token verification
      if (loginData.data && loginData.data.token) {
        const token = loginData.data.token;
        
        const verifyResponse = await fetch(`${API_BASE_URL}/auth/verify-token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        console.log('Verify token response status:', verifyResponse.status);
        
        if (verifyResponse.ok) {
          const verifyData = await verifyResponse.json();
          console.log('✅ Token verification successful:', verifyData);
        } else {
          console.log('❌ Token verification failed');
        }
      }
    } else {
      console.log('❌ Login failed - user might not exist');
    }
  } catch (error) {
    console.log('❌ Error in user flow test:', error.message);
  }
}

// Run all tests
async function runTests() {
  console.log('🚀 Starting local fetch tests...\n');
  
  await testApiConnection();
  console.log('');
  
  await testVerifyToken();
  console.log('');
  
  await testUserFlow();
  console.log('');
  
  console.log('🏁 Tests completed!');
}

// Run tests if this script is executed directly
if (typeof window === 'undefined') {
  // Node.js environment
  const fetch = require('node-fetch');
  runTests();
} else {
  // Browser environment
  console.log('Run this script in Node.js or open browser console and run:');
  console.log('runTests()');
}
