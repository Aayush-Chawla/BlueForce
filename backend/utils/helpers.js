// Utility functions for the BlueForce backend

/**
 * Format date to ISO string
 * @param {Date} date - Date object
 * @returns {string} - Formatted date string
 */
const formatDate = (date) => {
  if (!date) return null;
  return new Date(date).toISOString();
};

/**
 * Check if a date is in the future
 * @param {Date|string} date - Date to check
 * @returns {boolean} - True if date is in the future
 */
const isFutureDate = (date) => {
  if (!date) return false;
  return new Date(date) > new Date();
};

/**
 * Generate a random string of specified length
 * @param {number} length - Length of the string
 * @returns {string} - Random string
 */
const generateRandomString = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Sanitize string input
 * @param {string} str - String to sanitize
 * @returns {string} - Sanitized string
 */
const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  return str.trim().replace(/[<>]/g, '');
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if email is valid
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Calculate time difference in hours
 * @param {Date|string} startDate - Start date
 * @param {Date|string} endDate - End date
 * @returns {number} - Hours difference
 */
const getHoursDifference = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return Math.abs(end - start) / (1000 * 60 * 60);
};

/**
 * Paginate results
 * @param {Array} data - Array of data
 * @param {number} page - Page number (1-based)
 * @param {number} limit - Items per page
 * @returns {Object} - Paginated result
 */
const paginate = (data, page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  const total = data.length;
  const totalPages = Math.ceil(total / limit);
  
  return {
    data: data.slice(offset, offset + limit),
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  };
};

/**
 * Create success response
 * @param {string} message - Success message
 * @param {*} data - Response data
 * @param {number} statusCode - HTTP status code
 * @returns {Object} - Success response object
 */
const createSuccessResponse = (message, data = null, statusCode = 200) => {
  const response = {
    success: true,
    message,
    timestamp: new Date().toISOString()
  };
  
  if (data !== null) {
    response.data = data;
  }
  
  return { response, statusCode };
};

/**
 * Create error response
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 * @param {*} details - Error details
 * @returns {Object} - Error response object
 */
const createErrorResponse = (message, statusCode = 500, details = null) => {
  const response = {
    success: false,
    message,
    timestamp: new Date().toISOString()
  };
  
  if (details !== null) {
    response.details = details;
  }
  
  return { response, statusCode };
};

/**
 * Extract pagination parameters from query
 * @param {Object} query - Express query object
 * @returns {Object} - Pagination parameters
 */
const extractPaginationParams = (query) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10));
  
  return { page, limit };
};

/**
 * Check if user has permission for resource
 * @param {Object} user - User object
 * @param {Object} resource - Resource object
 * @param {string} ownerField - Field name that contains owner ID
 * @returns {boolean} - True if user has permission
 */
const hasPermission = (user, resource, ownerField = 'ngo_id') => {
  if (!user || !resource) return false;
  
  // Admin has all permissions
  if (user.role === 'admin') return true;
  
  // Check if user owns the resource
  return user.id === resource[ownerField];
};

module.exports = {
  formatDate,
  isFutureDate,
  generateRandomString,
  sanitizeString,
  isValidEmail,
  getHoursDifference,
  paginate,
  createSuccessResponse,
  createErrorResponse,
  extractPaginationParams,
  hasPermission
};
