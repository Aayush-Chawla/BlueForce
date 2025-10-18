const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'blueforce_db',
  port: process.env.DB_PORT || 3306,
  multipleStatements: true
};

const connection = mysql.createConnection(dbConfig);

// Sample data
const sampleUsers = [
  {
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: 'password123',
    role: 'volunteer'
  },
  {
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    password: 'password123',
    role: 'volunteer'
  },
  {
    name: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    password: 'password123',
    role: 'volunteer'
  },
  {
    name: 'Sarah Wilson',
    email: 'sarah.wilson@example.com',
    password: 'password123',
    role: 'volunteer'
  },
  {
    name: 'Eco Warriors NGO',
    email: 'contact@ecowarriors.org',
    password: 'ngo123',
    role: 'ngo'
  },
  {
    name: 'Ocean Guardians',
    email: 'info@oceanguardians.org',
    password: 'ngo123',
    role: 'ngo'
  },
  {
    name: 'Beach Cleaners United',
    email: 'admin@beachcleaners.org',
    password: 'ngo123',
    role: 'ngo'
  },
  {
    name: 'System Admin',
    email: 'admin@blueforce.com',
    password: 'admin123',
    role: 'admin'
  }
];

const sampleEvents = [
  {
    ngo_id: 5, // Eco Warriors NGO
    title: 'Marina Beach Cleanup Drive',
    description: 'Join us for a comprehensive beach cleanup at Marina Beach. We will provide all necessary equipment including gloves, bags, and refreshments. This is a great opportunity to make a positive impact on our environment and meet like-minded individuals.',
    location: 'Marina Beach, Chennai, Tamil Nadu',
    date_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
  },
  {
    ngo_id: 5,
    title: 'Juhu Beach Cleanup',
    description: 'Help us clean up Juhu Beach and protect marine life. We will focus on plastic waste removal and educate participants about marine conservation.',
    location: 'Juhu Beach, Mumbai, Maharashtra',
    date_time: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days from now
  },
  {
    ngo_id: 6, // Ocean Guardians
    title: 'Goa Beach Conservation Event',
    description: 'A special beach cleanup event in Goa focusing on coral reef protection and marine ecosystem conservation.',
    location: 'Calangute Beach, Goa',
    date_time: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000) // 21 days from now
  },
  {
    ngo_id: 7, // Beach Cleaners United
    title: 'Kerala Coastal Cleanup',
    description: 'Join our coastal cleanup drive in Kerala. We will also conduct awareness sessions about sustainable living and ocean conservation.',
    location: 'Kovalam Beach, Kerala',
    date_time: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000) // 28 days from now
  },
  {
    ngo_id: 5,
    title: 'Puri Beach Cleanup',
    description: 'Clean up Puri Beach and help protect the marine ecosystem. This event is part of our monthly beach cleanup initiative.',
    location: 'Puri Beach, Odisha',
    date_time: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000) // 35 days from now
  }
];

const sampleEnrollments = [
  { event_id: 1, user_id: 1, status: 'enrolled' }, // John in Marina Beach
  { event_id: 1, user_id: 2, status: 'enrolled' }, // Jane in Marina Beach
  { event_id: 1, user_id: 3, status: 'enrolled' }, // Mike in Marina Beach
  { event_id: 2, user_id: 1, status: 'enrolled' }, // John in Juhu Beach
  { event_id: 2, user_id: 4, status: 'enrolled' }, // Sarah in Juhu Beach
  { event_id: 3, user_id: 2, status: 'enrolled' }, // Jane in Goa
  { event_id: 3, user_id: 3, status: 'enrolled' }, // Mike in Goa
  { event_id: 4, user_id: 1, status: 'enrolled' }, // John in Kerala
  { event_id: 4, user_id: 4, status: 'enrolled' }, // Sarah in Kerala
  { event_id: 5, user_id: 2, status: 'enrolled' }, // Jane in Puri
  { event_id: 5, user_id: 3, status: 'enrolled' }, // Mike in Puri
  { event_id: 5, user_id: 4, status: 'enrolled' }  // Sarah in Puri
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await connection.promise().query('DELETE FROM event_participants');
    await connection.promise().query('DELETE FROM events');
    await connection.promise().query('DELETE FROM users');
    
    // Reset auto-increment counters
    await connection.promise().query('ALTER TABLE users AUTO_INCREMENT = 1');
    await connection.promise().query('ALTER TABLE events AUTO_INCREMENT = 1');
    await connection.promise().query('ALTER TABLE event_participants AUTO_INCREMENT = 1');
    
    // Insert users
    console.log('👥 Inserting users...');
    for (const user of sampleUsers) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await connection.promise().execute(
        'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
        [user.name, user.email, hashedPassword, user.role]
      );
    }
    
    // Insert events
    console.log('📅 Inserting events...');
    for (const event of sampleEvents) {
      await connection.promise().execute(
        'INSERT INTO events (ngo_id, title, description, location, date_time) VALUES (?, ?, ?, ?, ?)',
        [event.ngo_id, event.title, event.description, event.location, event.date_time]
      );
    }
    
    // Insert enrollments
    console.log('📝 Inserting enrollments...');
    for (const enrollment of sampleEnrollments) {
      await connection.promise().execute(
        'INSERT INTO event_participants (event_id, user_id, status) VALUES (?, ?, ?)',
        [enrollment.event_id, enrollment.user_id, enrollment.status]
      );
    }
    
    console.log('✅ Database seeded successfully!');
    console.log('\n📊 Sample Data Summary:');
    console.log(`👥 Users: ${sampleUsers.length} (${sampleUsers.filter(u => u.role === 'volunteer').length} volunteers, ${sampleUsers.filter(u => u.role === 'ngo').length} NGOs, ${sampleUsers.filter(u => u.role === 'admin').length} admin)`);
    console.log(`📅 Events: ${sampleEvents.length}`);
    console.log(`📝 Enrollments: ${sampleEnrollments.length}`);
    
    console.log('\n🔑 Test Credentials:');
    console.log('Volunteer: john.doe@example.com / password123');
    console.log('NGO: contact@ecowarriors.org / ngo123');
    console.log('Admin: admin@blueforce.com / admin123');
    
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    throw error;
  } finally {
    connection.end();
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('\n🎉 Seeding completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedDatabase };
