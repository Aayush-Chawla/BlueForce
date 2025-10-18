const db = require('../config/database');

class EventParticipant {
  constructor(data) {
    this.id = data.id;
    this.event_id = data.event_id;
    this.user_id = data.user_id;
    this.enrolled_at = data.enrolled_at;
    this.status = data.status;
  }

  // Enroll a user in an event
  static async enroll(eventId, userId) {
    // Check if user is already enrolled
    const existingEnrollment = await this.findByEventAndUser(eventId, userId);
    if (existingEnrollment) {
      throw new Error('User is already enrolled in this event');
    }

    const query = `
      INSERT INTO event_participants (event_id, user_id, status)
      VALUES (?, ?, 'enrolled')
    `;
    
    const [result] = await db.promise().execute(query, [eventId, userId]);
    return result.insertId;
  }

  // Get all participants for an event
  static async findByEvent(eventId) {
    const query = `
      SELECT ep.*, u.name, u.email, u.role
      FROM event_participants ep
      JOIN users u ON ep.user_id = u.id
      WHERE ep.event_id = ? AND ep.status = 'enrolled'
      ORDER BY ep.enrolled_at ASC
    `;
    
    const [rows] = await db.promise().execute(query, [eventId]);
    return rows;
  }

  // Get enrollment by event and user
  static async findByEventAndUser(eventId, userId) {
    const query = `
      SELECT ep.*, u.name, u.email
      FROM event_participants ep
      JOIN users u ON ep.user_id = u.id
      WHERE ep.event_id = ? AND ep.user_id = ?
    `;
    
    const [rows] = await db.promise().execute(query, [eventId, userId]);
    return rows[0] || null;
  }

  // Get all events a user is enrolled in
  static async findByUser(userId) {
    const query = `
      SELECT ep.*, e.title, e.description, e.location, e.date_time, u.name as ngo_name
      FROM event_participants ep
      JOIN events e ON ep.event_id = e.id
      JOIN users u ON e.ngo_id = u.id
      WHERE ep.user_id = ? AND ep.status = 'enrolled'
      ORDER BY e.date_time ASC
    `;
    
    const [rows] = await db.promise().execute(query, [userId]);
    return rows;
  }

  // Cancel enrollment
  static async cancelEnrollment(eventId, userId) {
    const query = `
      UPDATE event_participants 
      SET status = 'cancelled', enrolled_at = CURRENT_TIMESTAMP
      WHERE event_id = ? AND user_id = ? AND status = 'enrolled'
    `;
    
    const [result] = await db.promise().execute(query, [eventId, userId]);
    return result.affectedRows > 0;
  }

  // Mark participation as completed
  static async markCompleted(eventId, userId) {
    const query = `
      UPDATE event_participants 
      SET status = 'completed'
      WHERE event_id = ? AND user_id = ? AND status = 'enrolled'
    `;
    
    const [result] = await db.promise().execute(query, [eventId, userId]);
    return result.affectedRows > 0;
  }

  // Get participant count for an event
  static async getParticipantCount(eventId) {
    const query = `
      SELECT COUNT(*) as count
      FROM event_participants
      WHERE event_id = ? AND status = 'enrolled'
    `;
    
    const [rows] = await db.promise().execute(query, [eventId]);
    return rows[0].count;
  }

  // Check if user is enrolled in event
  static async isEnrolled(eventId, userId) {
    const query = `
      SELECT 1 FROM event_participants
      WHERE event_id = ? AND user_id = ? AND status = 'enrolled'
    `;
    
    const [rows] = await db.promise().execute(query, [eventId, userId]);
    return rows.length > 0;
  }

  // Get enrollment statistics
  static async getEnrollmentStats(eventId) {
    const query = `
      SELECT 
        COUNT(CASE WHEN status = 'enrolled' THEN 1 END) as enrolled_count,
        COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_count,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_count,
        COUNT(*) as total_count
      FROM event_participants
      WHERE event_id = ?
    `;
    
    const [rows] = await db.promise().execute(query, [eventId]);
    return rows[0];
  }
}

module.exports = EventParticipant;
