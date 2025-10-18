const express = require('express');
const Event = require('../models/Event');
const EventParticipant = require('../models/EventParticipant');
const { authenticateToken, requireNGO, requireOwnershipOrAdmin } = require('../middleware/auth');
const { validateEventId, validateUserId, handleValidationErrors } = require('../middleware/validation');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// POST /api/events/:id/enroll - Volunteer enrolls in event
router.post('/:id/enroll',
  authenticateToken,
  validateEventId,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const eventId = parseInt(req.params.id);
    const userId = req.user.id;

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if event is in the future
    const eventDate = new Date(event.date_time);
    const now = new Date();
    if (eventDate <= now) {
      return res.status(400).json({
        success: false,
        message: 'Cannot enroll in past events'
      });
    }

    // Check if user is already enrolled
    const isEnrolled = await EventParticipant.isEnrolled(eventId, userId);
    if (isEnrolled) {
      return res.status(409).json({
        success: false,
        message: 'You are already enrolled in this event'
      });
    }

    // Enroll the user
    const enrollmentId = await EventParticipant.enroll(eventId, userId);
    const enrollment = await EventParticipant.findByEventAndUser(eventId, userId);

    res.status(201).json({
      success: true,
      message: 'Successfully enrolled in event',
      data: enrollment
    });
  })
);

// GET /api/events/:id/participants - List enrolled volunteers
router.get('/:id/participants',
  authenticateToken,
  validateEventId,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const eventId = parseInt(req.params.id);

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user can view participants (NGO owner or admin)
    if (req.user.role !== 'admin' && req.user.id !== event.ngo_id) {
      return res.status(403).json({
        success: false,
        message: 'You can only view participants for your own events'
      });
    }

    const participants = await EventParticipant.findByEvent(eventId);
    const stats = await EventParticipant.getEnrollmentStats(eventId);

    res.json({
      success: true,
      message: 'Participants retrieved successfully',
      data: {
        participants,
        stats,
        event: {
          id: event.id,
          title: event.title,
          date_time: event.date_time,
          location: event.location
        }
      }
    });
  })
);

// DELETE /api/events/:id/enroll - Cancel enrollment
router.delete('/:id/enroll',
  authenticateToken,
  validateEventId,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const eventId = parseInt(req.params.id);
    const userId = req.user.id;

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user is enrolled
    const isEnrolled = await EventParticipant.isEnrolled(eventId, userId);
    if (!isEnrolled) {
      return res.status(404).json({
        success: false,
        message: 'You are not enrolled in this event'
      });
    }

    // Cancel enrollment
    const cancelled = await EventParticipant.cancelEnrollment(eventId, userId);

    if (!cancelled) {
      return res.status(400).json({
        success: false,
        message: 'Failed to cancel enrollment'
      });
    }

    res.json({
      success: true,
      message: 'Enrollment cancelled successfully'
    });
  })
);

// GET /api/users/:userId/events - Get all events a user is enrolled in
router.get('/users/:userId/events',
  authenticateToken,
  asyncHandler(async (req, res) => {
    const userId = parseInt(req.params.userId);

    // Check if user can view these enrollments
    if (req.user.role !== 'admin' && req.user.id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only view your own enrollments'
      });
    }

    const enrollments = await EventParticipant.findByUser(userId);

    res.json({
      success: true,
      message: 'User enrollments retrieved successfully',
      data: enrollments,
      count: enrollments.length
    });
  })
);

// POST /api/events/:id/complete - Mark participation as completed (NGO only)
router.post('/:id/complete',
  authenticateToken,
  requireNGO,
  validateEventId,
  validateUserId,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const eventId = parseInt(req.params.id);
    const { user_id } = req.body;

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user can mark completion (NGO owner or admin)
    if (req.user.role !== 'admin' && req.user.id !== event.ngo_id) {
      return res.status(403).json({
        success: false,
        message: 'You can only mark completion for your own events'
      });
    }

    // Check if user is enrolled
    const isEnrolled = await EventParticipant.isEnrolled(eventId, user_id);
    if (!isEnrolled) {
      return res.status(404).json({
        success: false,
        message: 'User is not enrolled in this event'
      });
    }

    // Mark as completed
    const completed = await EventParticipant.markCompleted(eventId, user_id);

    if (!completed) {
      return res.status(400).json({
        success: false,
        message: 'Failed to mark participation as completed'
      });
    }

    res.json({
      success: true,
      message: 'Participation marked as completed successfully'
    });
  })
);

// GET /api/events/:id/stats - Get enrollment statistics
router.get('/:id/stats',
  authenticateToken,
  validateEventId,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const eventId = parseInt(req.params.id);

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user can view stats (NGO owner or admin)
    if (req.user.role !== 'admin' && req.user.id !== event.ngo_id) {
      return res.status(403).json({
        success: false,
        message: 'You can only view stats for your own events'
      });
    }

    const stats = await EventParticipant.getEnrollmentStats(eventId);
    const participantCount = await EventParticipant.getParticipantCount(eventId);

    res.json({
      success: true,
      message: 'Event statistics retrieved successfully',
      data: {
        event: {
          id: event.id,
          title: event.title,
          date_time: event.date_time,
          location: event.location
        },
        stats: {
          ...stats,
          current_enrolled: participantCount
        }
      }
    });
  })
);

module.exports = router;
