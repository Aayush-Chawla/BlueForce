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

async function demonstrateDynamicFunctionality() {
  try {
    console.log('🎯 BlueForce Dynamic Data Demonstration\n');
    
    // 1. Show current state
    console.log('📊 CURRENT STATE:');
    const [events] = await connection.promise().execute(`
      SELECT e.id, e.title, e.location, 
             COUNT(ep.id) as participant_count
      FROM events e
      LEFT JOIN event_participants ep ON e.id = ep.event_id AND ep.status = 'enrolled'
      GROUP BY e.id
      ORDER BY e.id
    `);
    
    events.forEach(event => {
      console.log(`   Event ${event.id}: "${event.title}" - ${event.participant_count} participants`);
    });
    
    // 2. Show detailed enrollment status
    console.log('\n📝 DETAILED ENROLLMENT STATUS:');
    const [enrollments] = await connection.promise().execute(`
      SELECT e.title, u.name, ep.status, ep.enrolled_at
      FROM event_participants ep
      JOIN events e ON ep.event_id = e.id
      JOIN users u ON ep.user_id = u.id
      ORDER BY e.id, ep.status
    `);
    
    enrollments.forEach(enrollment => {
      console.log(`   ${enrollment.title}: ${enrollment.name} (${enrollment.status})`);
    });
    
    // 3. Simulate adding a new participant
    console.log('\n➕ SIMULATING: Adding new participant...');
    
    // Check if user 4 (Sarah) is already enrolled in event 1
    const [existing] = await connection.promise().execute(
      'SELECT * FROM event_participants WHERE event_id = 1 AND user_id = 4'
    );
    
    if (existing.length === 0) {
      // Add Sarah to event 1
      await connection.promise().execute(
        'INSERT INTO event_participants (event_id, user_id, status) VALUES (1, 4, "enrolled")'
      );
      console.log('   ✅ Sarah Wilson enrolled in Marina Beach Cleanup');
    } else {
      console.log('   ℹ️  Sarah Wilson is already enrolled in Marina Beach Cleanup');
    }
    
    // 4. Show updated state
    console.log('\n📊 UPDATED STATE:');
    const [updatedEvents] = await connection.promise().execute(`
      SELECT e.id, e.title, e.location, 
             COUNT(ep.id) as participant_count
      FROM events e
      LEFT JOIN event_participants ep ON e.id = ep.event_id AND ep.status = 'enrolled'
      GROUP BY e.id
      ORDER BY e.id
    `);
    
    updatedEvents.forEach(event => {
      console.log(`   Event ${event.id}: "${event.title}" - ${event.participant_count} participants`);
    });
    
    // 5. Simulate withdrawal
    console.log('\n➖ SIMULATING: User withdrawal...');
    
    // Cancel one enrollment
    const [result] = await connection.promise().execute(
      'UPDATE event_participants SET status = "cancelled" WHERE event_id = 1 AND user_id = 1 AND status = "enrolled"'
    );
    
    if (result.affectedRows > 0) {
      console.log('   ✅ John Doe withdrew from Marina Beach Cleanup');
    } else {
      console.log('   ℹ️  John Doe was not enrolled or already withdrew');
    }
    
    // 6. Show final state
    console.log('\n📊 FINAL STATE:');
    const [finalEvents] = await connection.promise().execute(`
      SELECT e.id, e.title, e.location, 
             COUNT(CASE WHEN ep.status = 'enrolled' THEN 1 END) as enrolled_count,
             COUNT(CASE WHEN ep.status = 'cancelled' THEN 1 END) as cancelled_count,
             COUNT(CASE WHEN ep.status = 'completed' THEN 1 END) as completed_count
      FROM events e
      LEFT JOIN event_participants ep ON e.id = ep.event_id
      GROUP BY e.id
      ORDER BY e.id
    `);
    
    finalEvents.forEach(event => {
      console.log(`   Event ${event.id}: "${event.title}"`);
      console.log(`      Enrolled: ${event.enrolled_count}, Cancelled: ${event.cancelled_count}, Completed: ${event.completed_count}`);
    });
    
    // 7. Show real-time statistics
    console.log('\n📈 REAL-TIME STATISTICS:');
    const [stats] = await connection.promise().execute(`
      SELECT 
        COUNT(CASE WHEN status = 'enrolled' THEN 1 END) as total_enrolled,
        COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as total_cancelled,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as total_completed,
        COUNT(*) as total_enrollments
      FROM event_participants
    `);
    
    const stat = stats[0];
    console.log(`   Total Enrolled: ${stat.total_enrolled}`);
    console.log(`   Total Cancelled: ${stat.total_cancelled}`);
    console.log(`   Total Completed: ${stat.total_completed}`);
    console.log(`   Total Enrollments: ${stat.total_enrollments}`);
    
    console.log('\n🎉 Dynamic functionality demonstration completed!');
    console.log('\n💡 Key Features Demonstrated:');
    console.log('   ✅ Real-time participant counting');
    console.log('   ✅ Dynamic enrollment/withdrawal');
    console.log('   ✅ Status tracking (enrolled/cancelled/completed)');
    console.log('   ✅ Automatic statistics calculation');
    console.log('   ✅ Database integrity maintenance');
    
  } catch (error) {
    console.error('❌ Demonstration failed:', error);
  } finally {
    connection.end();
  }
}

// Run demonstration
demonstrateDynamicFunctionality();
