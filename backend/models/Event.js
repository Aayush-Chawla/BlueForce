const db = require('../config/database');

class Event {
  constructor(data) {
    this.id = data.id;
    this.ngo_id = data.ngo_id;
    this.title = data.title;
    this.description = data.description;
    this.location = data.location;
    this.date_time = data.date_time;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  // Create a new event
  static async create(eventData) {
    const { ngo_id, title, description, location, date_time } = eventData;
    
    const query = `
      INSERT INTO events (ngo_id, title, description, location, date_time)
      VALUES (?, ?, ?, ?, ?)
    `;
    
    const [result] = await db.promise().execute(query, [
      ngo_id, title, description, location, date_time
    ]);
    
    return result.insertId;
  }

  // Get all events
  static async findAll(filters = {}) {
    let query = `
      SELECT e.*, u.name as ngo_name, u.email as ngo_email,
             COUNT(ep.id) as participant_count
      FROM events e
      LEFT JOIN users u ON e.ngo_id = u.id
      LEFT JOIN event_participants ep ON e.id = ep.event_id AND ep.status = 'enrolled'
    `;
    
    const conditions = [];
    const params = [];
    
    if (filters.upcoming) {
      conditions.push('e.date_time > NOW()');
    }
    
    if (filters.ngo_id) {
      conditions.push('e.ngo_id = ?');
      params.push(filters.ngo_id);
    }
    
    if (filters.location) {
      conditions.push('e.location LIKE ?');
      params.push(`%${filters.location}%`);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' GROUP BY e.id ORDER BY e.date_time ASC';
    
    const [rows] = await db.promise().execute(query, params);
    return rows;
  }

  // Get event by ID
  static async findById(id) {
    const query = `
      SELECT e.*, u.name as ngo_name, u.email as ngo_email,
             COUNT(ep.id) as participant_count
      FROM events e
      LEFT JOIN users u ON e.ngo_id = u.id
      LEFT JOIN event_participants ep ON e.id = ep.event_id AND ep.status = 'enrolled'
      WHERE e.id = ?
      GROUP BY e.id
    `;
    
    const [rows] = await db.promise().execute(query, [id]);
    return rows[0] || null;
  }

  // Update event
  static async update(id, updateData) {
    const allowedFields = ['title', 'description', 'location', 'date_time'];
    const updates = [];
    const params = [];
    
    for (const [key, value] of Object.entries(updateData)) {
      if (allowedFields.includes(key) && value !== undefined) {
        updates.push(`${key} = ?`);
        params.push(value);
      }
    }
    
    if (updates.length === 0) {
      throw new Error('No valid fields to update');
    }
    
    params.push(id);
    
    const query = `
      UPDATE events 
      SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    const [result] = await db.promise().execute(query, params);
    return result.affectedRows > 0;
  }

  // Delete event
  static async delete(id) {
    const query = 'DELETE FROM events WHERE id = ?';
    const [result] = await db.promise().execute(query, [id]);
    return result.affectedRows > 0;
  }

  // Check if event exists
  static async exists(id) {
    const query = 'SELECT 1 FROM events WHERE id = ?';
    const [rows] = await db.promise().execute(query, [id]);
    return rows.length > 0;
  }

  // Get events by NGO
  static async findByNgo(ngo_id) {
    const query = `
      SELECT e.*, COUNT(ep.id) as participant_count
      FROM events e
      LEFT JOIN event_participants ep ON e.id = ep.event_id AND ep.status = 'enrolled'
      WHERE e.ngo_id = ?
      GROUP BY e.id
      ORDER BY e.date_time ASC
    `;
    
    const [rows] = await db.promise().execute(query, [ngo_id]);
    return rows;
  }
}

module.exports = Event;
