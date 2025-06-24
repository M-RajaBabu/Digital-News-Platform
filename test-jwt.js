require('dotenv').config();

console.log('JWT_SECRET:', process.env.JWT_SECRET);
console.log('JWT_SECRET length:', process.env.JWT_SECRET ? process.env.JWT_SECRET.length : 'undefined');

const jwt = require('jsonwebtoken');

try {
  const token = jwt.sign({ test: 'data' }, process.env.JWT_SECRET);
  console.log('✅ JWT token generated successfully');
  console.log('Token:', token.substring(0, 50) + '...');
} catch (error) {
  console.log('❌ JWT token generation failed:', error.message);
} 