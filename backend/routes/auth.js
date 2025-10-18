const express = require('express');
const User = require('../models/User');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Validation middleware for registration
const validateRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Name must be between 2 and 255 characters'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  
  body('role')
    .optional()
    .isIn(['volunteer', 'ngo', 'admin'])
    .withMessage('Role must be volunteer, ngo, or admin')
];

// Validation middleware for login
const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Validation middleware for profile update
const validateProfileUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Name must be between 2 and 255 characters'),
  
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address')
];

// Validation middleware for password change
const validatePasswordChange = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one lowercase letter, one uppercase letter, and one number')
];

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  next();
};

// POST /api/auth/register - User registration
router.post('/register',
  validateRegistration,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { name, email, password, role = 'volunteer' } = req.body;

    // Create user
    const userId = await User.create({
      name,
      email,
      password,
      role
    });

    // Get created user
    const user = await User.findById(userId);

    // Generate JWT token
    const token = User.generateToken(user);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          created_at: user.created_at
        },
        token
      }
    });
  })
);

// POST /api/auth/login - User login
router.post('/login',
  validateLogin,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Authenticate user
    const user = await User.authenticate(email, password);

    // Generate JWT token
    const token = User.generateToken(user);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          created_at: user.created_at
        },
        token
      }
    });
  })
);

// GET /api/auth/me - Get current user info
router.get('/me',
  authenticateToken,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User information retrieved successfully',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          created_at: user.created_at,
          updated_at: user.updated_at
        }
      }
    });
  })
);

// PUT /api/auth/profile - Update user profile
router.put('/profile',
  authenticateToken,
  validateProfileUpdate,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { name, email } = req.body;

    // Check if email is already taken by another user
    if (email) {
      const existingUser = await User.findByEmail(email);
      if (existingUser && existingUser.id !== userId) {
        return res.status(409).json({
          success: false,
          message: 'Email is already taken by another user'
        });
      }
    }

    // Update profile
    const updated = await User.updateProfile(userId, { name, email });

    if (!updated) {
      return res.status(400).json({
        success: false,
        message: 'Failed to update profile'
      });
    }

    // Get updated user
    const user = await User.findById(userId);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          created_at: user.created_at,
          updated_at: user.updated_at
        }
      }
    });
  })
);

// PUT /api/auth/change-password - Change password
router.put('/change-password',
  authenticateToken,
  validatePasswordChange,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    // Change password
    const changed = await User.changePassword(userId, currentPassword, newPassword);

    if (!changed) {
      return res.status(400).json({
        success: false,
        message: 'Failed to change password'
      });
    }

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  })
);

// POST /api/auth/logout - Logout (client-side token removal)
router.post('/logout',
  authenticateToken,
  asyncHandler(async (req, res) => {
    // Since we're using stateless JWT tokens, logout is handled client-side
    // by removing the token from storage. This endpoint is for consistency.
    res.json({
      success: true,
      message: 'Logout successful. Please remove the token from client storage.'
    });
  })
);

// GET /api/auth/users - Get all users (admin only)
router.get('/users',
  authenticateToken,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { role, search } = req.query;
    const filters = {};

    if (role) filters.role = role;
    if (search) filters.search = search;

    const users = await User.findAll(filters);

    res.json({
      success: true,
      message: 'Users retrieved successfully',
      data: users,
      count: users.length
    });
  })
);

// GET /api/auth/stats - Get user statistics (admin only)
router.get('/stats',
  authenticateToken,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const stats = await User.getStats();

    res.json({
      success: true,
      message: 'User statistics retrieved successfully',
      data: stats
    });
  })
);

// DELETE /api/auth/users/:id - Delete user (admin only)
router.delete('/users/:id',
  authenticateToken,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const userId = parseInt(req.params.id);

    // Prevent admin from deleting themselves
    if (userId === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account'
      });
    }

    // Check if user exists
    const userExists = await User.exists(userId);
    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Delete user
    const deleted = await User.delete(userId);

    if (!deleted) {
      return res.status(400).json({
        success: false,
        message: 'Failed to delete user'
      });
    }

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  })
);

module.exports = router;
