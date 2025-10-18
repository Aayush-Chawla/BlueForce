const { body, param, query, validationResult } = require('express-validator');

// Validation rules for event creation
const validateEventCreation = [
  body('ngo_id')
    .isInt({ min: 1 })
    .withMessage('NGO ID must be a positive integer'),
  
  body('title')
    .trim()
    .isLength({ min: 3, max: 255 })
    .withMessage('Title must be between 3 and 255 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description must not exceed 2000 characters'),
  
  body('location')
    .trim()
    .isLength({ min: 3, max: 255 })
    .withMessage('Location must be between 3 and 255 characters'),
  
  body('date_time')
    .isISO8601()
    .withMessage('Date and time must be a valid ISO 8601 format')
    .custom((value) => {
      const eventDate = new Date(value);
      const now = new Date();
      if (eventDate <= now) {
        throw new Error('Event date must be in the future');
      }
      return true;
    })
];

// Validation rules for event update
const validateEventUpdate = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 255 })
    .withMessage('Title must be between 3 and 255 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description must not exceed 2000 characters'),
  
  body('location')
    .optional()
    .trim()
    .isLength({ min: 3, max: 255 })
    .withMessage('Location must be between 3 and 255 characters'),
  
  body('date_time')
    .optional()
    .isISO8601()
    .withMessage('Date and time must be a valid ISO 8601 format')
    .custom((value) => {
      if (value) {
        const eventDate = new Date(value);
        const now = new Date();
        if (eventDate <= now) {
          throw new Error('Event date must be in the future');
        }
      }
      return true;
    })
];

// Validation rules for event ID parameter
const validateEventId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Event ID must be a positive integer')
];

// Validation rules for user ID parameter
const validateUserId = [
  body('user_id')
    .isInt({ min: 1 })
    .withMessage('User ID must be a positive integer')
];

// Validation rules for query parameters
const validateEventQuery = [
  query('upcoming')
    .optional()
    .isBoolean()
    .withMessage('Upcoming parameter must be a boolean'),
  
  query('ngo_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('NGO ID must be a positive integer'),
  
  query('location')
    .optional()
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Location must be between 1 and 255 characters')
];

// Middleware to handle validation errors
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

module.exports = {
  validateEventCreation,
  validateEventUpdate,
  validateEventId,
  validateUserId,
  validateEventQuery,
  handleValidationErrors
};
