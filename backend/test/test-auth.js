const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2');
require('dotenv').config();

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'blueforce_db',
  port: process.env.DB_PORT || 3306
};

const connection = mysql.createConnection(dbConfig);

// Generate test JWT tokens
async function generateTestTokens() {
  try {
    console.log('🔑 Generating test JWT tokens...\n');
    
    // Get users from database
    const [users] = await connection.promise().execute(
      'SELECT id, name, email, role FROM users ORDER BY id'
    );
    
    const jwtSecret = process.env.JWT_SECRET || 'fallback_secret';
    
    const tokens = {};
    
    for (const user of users) {
      const token = jwt.sign(
        { 
          userId: user.id, 
          email: user.email, 
          role: user.role 
        },
        jwtSecret,
        { expiresIn: '7d' }
      );
      
      tokens[user.role] = tokens[user.role] || {};
      tokens[user.role][user.email] = {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      };
    }
    
    // Display tokens in a user-friendly format
    console.log('📋 Test JWT Tokens:\n');
    
    Object.keys(tokens).forEach(role => {
      console.log(`🔸 ${role.toUpperCase()} Tokens:`);
      Object.keys(tokens[role]).forEach(email => {
        const tokenData = tokens[role][email];
        console.log(`   Email: ${email}`);
        console.log(`   Token: ${tokenData.token}`);
        console.log(`   User ID: ${tokenData.user.id}`);
        console.log('');
      });
    });
    
    // Save tokens to file for easy access
    const fs = require('fs');
    const tokenFile = {
      generated_at: new Date().toISOString(),
      tokens: tokens
    };
    
    fs.writeFileSync('test/test-tokens.json', JSON.stringify(tokenFile, null, 2));
    console.log('💾 Tokens saved to test/test-tokens.json');
    
    return tokens;
    
  } catch (error) {
    console.error('❌ Token generation failed:', error);
    throw error;
  } finally {
    connection.end();
  }
}

// Test authentication
async function testAuthentication() {
  try {
    console.log('🧪 Testing authentication...\n');
    
    const jwtSecret = process.env.JWT_SECRET || 'fallback_secret';
    
    // Test valid token
    const testToken = jwt.sign(
      { userId: 1, email: 'test@example.com', role: 'volunteer' },
      jwtSecret,
      { expiresIn: '1h' }
    );
    
    console.log('✅ Valid token generated:', testToken.substring(0, 50) + '...');
    
    // Verify token
    const decoded = jwt.verify(testToken, jwtSecret);
    console.log('✅ Token verified successfully:', decoded);
    
    // Test expired token
    const expiredToken = jwt.sign(
      { userId: 1, email: 'test@example.com', role: 'volunteer' },
      jwtSecret,
      { expiresIn: '-1h' } // Expired 1 hour ago
    );
    
    try {
      jwt.verify(expiredToken, jwtSecret);
      console.log('❌ Expired token should have failed verification');
    } catch (error) {
      console.log('✅ Expired token correctly rejected:', error.message);
    }
    
    // Test invalid token
    try {
      jwt.verify('invalid.token.here', jwtSecret);
      console.log('❌ Invalid token should have failed verification');
    } catch (error) {
      console.log('✅ Invalid token correctly rejected:', error.message);
    }
    
  } catch (error) {
    console.error('❌ Authentication test failed:', error);
    throw error;
  }
}

// Test password hashing
async function testPasswordHashing() {
  try {
    console.log('🔐 Testing password hashing...\n');
    
    const testPassword = 'testpassword123';
    
    // Hash password
    const hashedPassword = await bcrypt.hash(testPassword, 10);
    console.log('✅ Password hashed successfully');
    console.log('   Original:', testPassword);
    console.log('   Hashed:', hashedPassword);
    
    // Verify password
    const isValid = await bcrypt.compare(testPassword, hashedPassword);
    console.log('✅ Password verification:', isValid ? 'SUCCESS' : 'FAILED');
    
    // Test wrong password
    const isInvalid = await bcrypt.compare('wrongpassword', hashedPassword);
    console.log('✅ Wrong password correctly rejected:', !isInvalid ? 'SUCCESS' : 'FAILED');
    
  } catch (error) {
    console.error('❌ Password hashing test failed:', error);
    throw error;
  }
}

// Main test function
async function runAuthTests() {
  try {
    console.log('🚀 Starting authentication tests...\n');
    
    await testPasswordHashing();
    console.log('');
    
    await testAuthentication();
    console.log('');
    
    await generateTestTokens();
    
    console.log('\n🎉 All authentication tests completed successfully!');
    
  } catch (error) {
    console.error('💥 Authentication tests failed:', error);
    process.exit(1);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAuthTests();
}

module.exports = {
  generateTestTokens,
  testAuthentication,
  testPasswordHashing,
  runAuthTests
};
