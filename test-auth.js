const http = require('http');

const baseUrl = 'http://localhost:3000';

function makeRequest(path, method = 'POST', body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          data: data,
          headers: res.headers
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function testAuth() {
  console.log('🔐 Testing Authentication APIs\n');
  console.log('=' .repeat(50));

  // Test registration
  console.log('🔍 Testing: Register User');
  const registerResponse = await makeRequest('/api/auth/register', 'POST', {
    email: 'newuser@example.com',
    username: 'newuser',
    password: 'password123',
    firstName: 'New',
    lastName: 'User'
  });
  
  console.log(`   Status: ${registerResponse.status}`);
  console.log(`   Response: ${registerResponse.data.substring(0, 200)}${registerResponse.data.length > 200 ? '...' : ''}`);
  
  if (registerResponse.status === 201) {
    console.log('   ✅ Registration successful!');
    
    // Test login
    console.log('\n🔍 Testing: Login User');
    const loginResponse = await makeRequest('/api/auth/login', 'POST', {
      email: 'newuser@example.com',
      password: 'password123'
    });
    
    console.log(`   Status: ${loginResponse.status}`);
    console.log(`   Response: ${loginResponse.data.substring(0, 200)}${loginResponse.data.length > 200 ? '...' : ''}`);
    
    if (loginResponse.status === 200) {
      console.log('   ✅ Login successful!');
      
      // Parse token for protected endpoint test
      try {
        const loginData = JSON.parse(loginResponse.data);
        if (loginData.token) {
          console.log('\n🔍 Testing: Protected Endpoint with Token');
          
          // Test a protected endpoint
          const protectedResponse = await makeRequest('/api/users/preferences', 'GET', null, loginData.token);
          console.log(`   Status: ${protectedResponse.status}`);
          console.log(`   Response: ${protectedResponse.data.substring(0, 200)}${protectedResponse.data.length > 200 ? '...' : ''}`);
        }
      } catch (e) {
        console.log('   ⚠️ Could not parse login response');
      }
    } else {
      console.log('   ❌ Login failed');
    }
  } else {
    console.log('   ❌ Registration failed');
  }
}

testAuth().catch(console.error); 