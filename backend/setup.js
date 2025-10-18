#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Setting up BlueForce Backend Service...\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
const envSamplePath = path.join(__dirname, '.env.sample');

if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env file from sample...');
  
  if (fs.existsSync(envSamplePath)) {
    fs.copyFileSync(envSamplePath, envPath);
    console.log('✅ .env file created successfully');
    console.log('⚠️  Please update the .env file with your database credentials\n');
  } else {
    // Create basic .env file
    const envContent = `# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=blueforce_db
DB_PORT=3306

# Server Configuration
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d

# File Upload Configuration
UPLOAD_DIR=uploads/
MAX_FILE_SIZE=5242880

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
`;
    
    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env file created successfully');
    console.log('⚠️  Please update the .env file with your database credentials\n');
  }
} else {
  console.log('✅ .env file already exists\n');
}

// Check if node_modules exists
const nodeModulesPath = path.join(__dirname, 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
  console.log('📦 Installing dependencies...');
  try {
    execSync('npm install', { stdio: 'inherit', cwd: __dirname });
    console.log('✅ Dependencies installed successfully\n');
  } catch (error) {
    console.error('❌ Failed to install dependencies:', error.message);
    process.exit(1);
  }
} else {
  console.log('✅ Dependencies already installed\n');
}

// Create uploads directory
const uploadsPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsPath)) {
  console.log('📁 Creating uploads directory...');
  fs.mkdirSync(uploadsPath, { recursive: true });
  console.log('✅ Uploads directory created\n');
} else {
  console.log('✅ Uploads directory already exists\n');
}

console.log('🎉 Setup completed successfully!\n');
console.log('📋 Next steps:');
console.log('1. Update the .env file with your database credentials');
console.log('2. Make sure MySQL is running');
console.log('3. Run database migrations: npm run migrate');
console.log('4. Start the server: npm run dev');
console.log('\n📚 For more information, check the README.md file');
console.log('🔗 API Documentation: API_DOCUMENTATION.md');
