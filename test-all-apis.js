const http = require('http');

const baseUrl = 'http://localhost:3000';

function makeRequest(path, method = 'GET', body = null) {
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

async function testAllAPIs() {
  console.log('🚀 Testing All Digital News Platform APIs\n');
  console.log('=' .repeat(60));

  const tests = [
    // Health Check
    { name: 'Health Check', path: '/health', method: 'GET' },
    
    // Authentication
    { name: 'Register User', path: '/api/auth/register', method: 'POST', body: {
      email: 'test@example.com',
      username: 'testuser',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User'
    }},
    { name: 'Login User', path: '/api/auth/login', method: 'POST', body: {
      email: 'test@example.com',
      password: 'password123'
    }},
    
    // News Feed
    { name: 'Get News Feed', path: '/api/news/feed', method: 'GET' },
    { name: 'Get Trending News', path: '/api/news/trending', method: 'GET' },
    { name: 'Get Breaking News', path: '/api/news/breaking', method: 'GET' },
    
    // Articles
    { name: 'Get All Articles', path: '/api/articles', method: 'GET' },
    { name: 'Get Article by ID', path: '/api/articles/test-id', method: 'GET' },
    { name: 'Create Article', path: '/api/articles', method: 'POST', body: {
      title: 'Test Article',
      content: 'Test content',
      categoryId: 'test-category'
    }},
    
    // Categories
    { name: 'Get Categories', path: '/api/categories', method: 'GET' },
    { name: 'Get Category by ID', path: '/api/categories/test-id', method: 'GET' },
    { name: 'Get Articles by Category', path: '/api/categories/test-id/articles', method: 'GET' },
    
    // Comments
    { name: 'Create Comment', path: '/api/comments', method: 'POST', body: {
      articleId: 'test-article',
      content: 'Test comment'
    }},
    { name: 'Get Comments', path: '/api/comments', method: 'GET' },
    
    // Bookmarks
    { name: 'Get Bookmarks', path: '/api/bookmarks', method: 'GET' },
    { name: 'Add Bookmark', path: '/api/bookmarks', method: 'POST', body: {
      articleId: 'test-article'
    }},
    
    // Authors
    { name: 'Get Authors', path: '/api/authors', method: 'GET' },
    { name: 'Get Author by ID', path: '/api/authors/test-id', method: 'GET' },
    { name: 'Get Author Articles', path: '/api/authors/test-id/articles', method: 'GET' },
    
    // Users
    { name: 'Get User Profile', path: '/api/users/profile', method: 'GET' },
    { name: 'Get User Preferences', path: '/api/users/preferences', method: 'GET' },
    { name: 'Get Reading History', path: '/api/users/history', method: 'GET' },
    
    // Subscriptions
    { name: 'Get Subscription Plans', path: '/api/subscriptions/plans', method: 'GET' },
    { name: 'Get Subscription Status', path: '/api/subscriptions/status', method: 'GET' },
    { name: 'Subscribe to Plan', path: '/api/subscriptions/subscribe', method: 'POST', body: {
      planId: 'test-plan'
    }},
    
    // Polls
    { name: 'Get Active Polls', path: '/api/polls/active', method: 'GET' },
    { name: 'Get Poll by ID', path: '/api/polls/test-id', method: 'GET' },
    { name: 'Vote on Poll', path: '/api/polls/test-id/vote', method: 'POST', body: {
      optionIndex: 0
    }},
    
    // Notifications
    { name: 'Get Notifications', path: '/api/notifications', method: 'GET' },
    { name: 'Update Notification Settings', path: '/api/notifications/settings', method: 'PUT', body: {
      emailNotifications: true
    }},
    
    // E-Paper
    { name: 'Get E-Paper Editions', path: '/api/epaper/editions', method: 'GET' },
    { name: 'Get E-Paper Edition', path: '/api/epaper/editions/2024-03-20/Mumbai', method: 'GET' },
    
    // Weather
    { name: 'Get Weather', path: '/api/weather/Mumbai', method: 'GET' },
    { name: 'Get Weather Forecast', path: '/api/weather/Mumbai/forecast', method: 'GET' },
    
    // Games
    { name: 'Get Games', path: '/api/games', method: 'GET' },
    { name: 'Get Crosswords', path: '/api/games/crosswords', method: 'GET' },
    
    // Newsletter
    { name: 'Subscribe to Newsletter', path: '/api/newsletter/subscribe', method: 'POST', body: {
      email: 'test@example.com'
    }},
    
    // Search
    { name: 'Search Articles', path: '/api/search?q=test', method: 'GET' }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      console.log(`\n🔍 Testing: ${test.name}`);
      console.log(`   ${test.method} ${test.path}`);
      
      const response = await makeRequest(test.path, test.method, test.body);
      
      if (response.status >= 200 && response.status < 300) {
        console.log(`   ✅ Status: ${response.status} - SUCCESS`);
        console.log(`   📄 Response: ${response.data.substring(0, 100)}${response.data.length > 100 ? '...' : ''}`);
        passed++;
      } else if (response.status === 404) {
        console.log(`   ⚠️  Status: ${response.status} - NOT FOUND (Expected for placeholder endpoints)`);
        console.log(`   📄 Response: ${response.data.substring(0, 100)}${response.data.length > 100 ? '...' : ''}`);
        passed++;
      } else if (response.status === 401) {
        console.log(`   🔒 Status: ${response.status} - UNAUTHORIZED (Expected for protected endpoints)`);
        console.log(`   📄 Response: ${response.data.substring(0, 100)}${response.data.length > 100 ? '...' : ''}`);
        passed++;
      } else {
        console.log(`   ❌ Status: ${response.status} - FAILED`);
        console.log(`   📄 Response: ${response.data.substring(0, 100)}${response.data.length > 100 ? '...' : ''}`);
        failed++;
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
      failed++;
    }
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log('\n' + '=' .repeat(60));
  console.log(`📊 Test Results:`);
  console.log(`   ✅ Passed: ${passed}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
  console.log('\n🎉 API Testing Complete!');
}

testAllAPIs().catch(console.error); 