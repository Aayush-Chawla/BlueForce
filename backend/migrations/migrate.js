const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  port: process.env.DB_PORT || 3306,
  multipleStatements: true
};

async function runMigrations() {
  const connection = mysql.createConnection(dbConfig);
  
  try {
    // Create database if it doesn't exist
    const dbName = process.env.DB_NAME || 'blueforce_db';
    await connection.promise().query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    await connection.promise().query(`USE \`${dbName}\``);
    
    console.log(`Database '${dbName}' created/verified successfully`);
    
    // Read and execute migration files
    const migrationsDir = path.join(__dirname);
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();
    
    for (const file of migrationFiles) {
      console.log(`Running migration: ${file}`);
      const migrationSQL = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
      await connection.promise().query(migrationSQL);
      console.log(`✓ Migration ${file} completed`);
    }
    
    console.log('All migrations completed successfully!');
    
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    connection.end();
  }
}

runMigrations();
