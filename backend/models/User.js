const db = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class User {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.role = data.role;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  // Create a new user (register)
  static async create(userData) {
    const { name, email, password, role = 'volunteer' } = userData;
    
    // Check if user already exists
    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);
    
    const query = `
      INSERT INTO users (name, email, password_hash, role)
      VALUES (?, ?, ?, ?)
    `;
    
    const [result] = await db.promise().execute(query, [
      name, email, password_hash, role
    ]);
    
    return result.insertId;
  }

  // Find user by email
  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = ?';
    const [rows] = await db.promise().execute(query, [email]);
    return rows[0] || null;
  }

  // Find user by ID
  static async findById(id) {
    const query = 'SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = ?';
    const [rows] = await db.promise().execute(query, [id]);
    return rows[0] || null;
  }

  // Authenticate user (login)
  static async authenticate(email, password) {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    // Return user without password hash
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
      updated_at: user.updated_at
    };
  }

  // Generate JWT token
  static generateToken(user) {
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role
    };

    const secret = process.env.JWT_SECRET || 'fallback_secret';
    const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

    return jwt.sign(payload, secret, { expiresIn });
  }

  // Verify JWT token
  static verifyToken(token) {
    const secret = process.env.JWT_SECRET || 'fallback_secret';
    return jwt.verify(token, secret);
  }

  // Update user profile
  static async updateProfile(id, updateData) {
    const allowedFields = ['name', 'email'];
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
      UPDATE users 
      SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    const [result] = await db.promise().execute(query, params);
    return result.affectedRows > 0;
  }

  // Change password
  static async changePassword(id, currentPassword, newPassword) {
    // Get user with password hash
    const query = 'SELECT password_hash FROM users WHERE id = ?';
    const [rows] = await db.promise().execute(query, [id]);
    
    if (rows.length === 0) {
      throw new Error('User not found');
    }
    
    const user = rows[0];
    
    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isValidPassword) {
      throw new Error('Current password is incorrect');
    }
    
    // Hash new password
    const saltRounds = 10;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);
    
    // Update password
    const updateQuery = `
      UPDATE users 
      SET password_hash = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    const [result] = await db.promise().execute(updateQuery, [newPasswordHash, id]);
    return result.affectedRows > 0;
  }

  // Get all users (admin only)
  static async findAll(filters = {}) {
    let query = 'SELECT id, name, email, role, created_at, updated_at FROM users';
    const conditions = [];
    const params = [];
    
    if (filters.role) {
      conditions.push('role = ?');
      params.push(filters.role);
    }
    
    if (filters.search) {
      conditions.push('(name LIKE ? OR email LIKE ?)');
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' ORDER BY created_at DESC';
    
    const [rows] = await db.promise().execute(query, params);
    return rows;
  }

  // Delete user (admin only)
  static async delete(id) {
    const query = 'DELETE FROM users WHERE id = ?';
    const [result] = await db.promise().execute(query, [id]);
    return result.affectedRows > 0;
  }

  // Check if user exists
  static async exists(id) {
    const query = 'SELECT 1 FROM users WHERE id = ?';
    const [rows] = await db.promise().execute(query, [id]);
    return rows.length > 0;
  }

  // Get user statistics
  static async getStats() {
    const query = `
      SELECT 
        COUNT(*) as total_users,
        COUNT(CASE WHEN role = 'volunteer' THEN 1 END) as volunteers,
        COUNT(CASE WHEN role = 'ngo' THEN 1 END) as ngos,
        COUNT(CASE WHEN role = 'admin' THEN 1 END) as admins
      FROM users
    `;
    
    const [rows] = await db.promise().execute(query);
    return rows[0];
  }
}

module.exports = User;
