const mysql = require('mysql2');
require('dotenv').config();

// Test database configuration
const testDbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'blueforce_db',
  port: process.env.DB_PORT || 3306,
  multipleStatements: true
};

// Create test database connection
const createTestConnection = () => {
  return mysql.createConnection(testDbConfig);
};

// Test database setup
const setupTestDatabase = async () => {
  const connection = createTestConnection();
  
  try {
    console.log('🧪 Setting up test database...');
    
    // Create test database if it doesn't exist
    const testDbName = (process.env.DB_NAME || 'blueforce_db') + '_test';
    await connection.promise().query(`CREATE DATABASE IF NOT EXISTS \`${testDbName}\``);
    await connection.promise().query(`USE \`${testDbName}\``);
    
    // Create tables
    const createTablesSQL = `
      -- Create users table
      CREATE TABLE IF NOT EXISTS users (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role ENUM('volunteer', 'ngo', 'admin') DEFAULT 'volunteer',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );

      -- Create events table
      CREATE TABLE IF NOT EXISTS events (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        ngo_id BIGINT NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        location VARCHAR(255) NOT NULL,
        date_time DATETIME NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (ngo_id) REFERENCES users(id) ON DELETE CASCADE
      );

      -- Create event_participants table
      CREATE TABLE IF NOT EXISTS event_participants (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        event_id BIGINT NOT NULL,
        user_id BIGINT NOT NULL,
        enrolled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        status ENUM('enrolled', 'cancelled', 'completed') DEFAULT 'enrolled',
        FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY unique_enrollment (event_id, user_id)
      );
    `;
    
    await connection.promise().query(createTablesSQL);
    console.log('✅ Test database tables created successfully');
    
    return testDbName;
  } catch (error) {
    console.error('❌ Test database setup failed:', error);
    throw error;
  } finally {
    connection.end();
  }
};

// Clean test database
const cleanTestDatabase = async () => {
  const connection = createTestConnection();
  
  try {
    const testDbName = (process.env.DB_NAME || 'blueforce_db') + '_test';
    await connection.promise().query(`DROP DATABASE IF EXISTS \`${testDbName}\``);
    console.log('🧹 Test database cleaned successfully');
  } catch (error) {
    console.error('❌ Test database cleanup failed:', error);
    throw error;
  } finally {
    connection.end();
  }
};

// Insert test data
const insertTestData = async () => {
  const connection = createTestConnection();
  
  try {
    const testDbName = (process.env.DB_NAME || 'blueforce_db') + '_test';
    await connection.promise().query(`USE \`${testDbName}\``);
    
    // Insert test users
    const users = [
      { name: 'John Doe', email: 'john@example.com', password_hash: 'hashed_password_1', role: 'volunteer' },
      { name: 'Jane Smith', email: 'jane@example.com', password_hash: 'hashed_password_2', role: 'volunteer' },
      { name: 'Eco Warriors NGO', email: 'ngo@ecowarriors.com', password_hash: 'hashed_password_3', role: 'ngo' },
      { name: 'Admin User', email: 'admin@blueforce.com', password_hash: 'hashed_password_4', role: 'admin' }
    ];
    
    for (const user of users) {
      await connection.promise().execute(
        'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
        [user.name, user.email, user.password_hash, user.role]
      );
    }
    
    // Insert test events
    const events = [
      {
        ngo_id: 3, // Eco Warriors NGO
        title: 'Marina Beach Cleanup',
        description: 'Join us for a beach cleanup at Marina Beach',
        location: 'Marina Beach, Chennai',
        date_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
      },
      {
        ngo_id: 3,
        title: 'Juhu Beach Cleanup',
        description: 'Clean up Juhu Beach with us',
        location: 'Juhu Beach, Mumbai',
        date_time: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days from now
      }
    ];
    
    for (const event of events) {
      await connection.promise().execute(
        'INSERT INTO events (ngo_id, title, description, location, date_time) VALUES (?, ?, ?, ?, ?)',
        [event.ngo_id, event.title, event.description, event.location, event.date_time]
      );
    }
    
    // Insert test enrollments
    const enrollments = [
      { event_id: 1, user_id: 1, status: 'enrolled' }, // John enrolled in Marina Beach
      { event_id: 1, user_id: 2, status: 'enrolled' }, // Jane enrolled in Marina Beach
      { event_id: 2, user_id: 1, status: 'enrolled' }  // John enrolled in Juhu Beach
    ];
    
    for (const enrollment of enrollments) {
      await connection.promise().execute(
        'INSERT INTO event_participants (event_id, user_id, status) VALUES (?, ?, ?)',
        [enrollment.event_id, enrollment.user_id, enrollment.status]
      );
    }
    
    console.log('✅ Test data inserted successfully');
  } catch (error) {
    console.error('❌ Test data insertion failed:', error);
    throw error;
  } finally {
    connection.end();
  }
};

module.exports = {
  createTestConnection,
  setupTestDatabase,
  cleanTestDatabase,
  insertTestData
};
