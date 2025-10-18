const express = require('express');
const Event = require('../models/Event');
const EventParticipant = require('../models/EventParticipant');
const { authenticateToken, requireNGO, requireOwnershipOrAdmin } = require('../middleware/auth');
const { 
  validateEventCreation, 
  validateEventUpdate, 
  validateEventId, 
  validateEventQuery,
  handleValidationErrors 
} = require('../middleware/validation');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// POST /api/events - Create new beach cleanup drive (NGO only)
router.post('/', 
  authenticateToken,
  requireNGO,
  validateEventCreation,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { ngo_id, title, description, location, date_time } = req.body;
    
    // Ensure the NGO ID matches the authenticated user
    if (req.user.role !== 'admin' && req.user.id !== ngo_id) {
      return res.status(403).json({
        success: false,
        message: 'You can only create events for your own NGO'
      });
    }

    const eventId = await Event.create({
      ngo_id,
      title,
      description,
      location,
      date_time
    });

    const newEvent = await Event.findById(eventId);

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: newEvent
    });
  })
);

// GET /api/events - List all upcoming events
router.get('/',
  validateEventQuery,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const filters = {
      upcoming: req.query.upcoming === 'true',
      ngo_id: req.query.ngo_id,
      location: req.query.location
    };

    const events = await Event.findAll(filters);

    res.json({
      success: true,
      message: 'Events retrieved successfully',
      data: events,
      count: events.length
    });
  })
);

// GET /api/events/:id - Get event details
router.get('/:id',
  validateEventId,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const eventId = parseInt(req.params.id);
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Get participants for this event
    const participants = await EventParticipant.findByEvent(eventId);
    const stats = await EventParticipant.getEnrollmentStats(eventId);

    res.json({
      success: true,
      message: 'Event details retrieved successfully',
      data: {
        ...event,
        participants,
        stats
      }
    });
  })
);

// PUT /api/events/:id - Update event (NGO owner or admin only)
router.put('/:id',
  authenticateToken,
  validateEventId,
  validateEventUpdate,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const eventId = parseInt(req.params.id);
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check ownership
    if (req.user.role !== 'admin' && req.user.id !== event.ngo_id) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own events'
      });
    }

    const updated = await Event.update(eventId, req.body);

    if (!updated) {
      return res.status(400).json({
        success: false,
        message: 'Failed to update event'
      });
    }

    const updatedEvent = await Event.findById(eventId);

    res.json({
      success: true,
      message: 'Event updated successfully',
      data: updatedEvent
    });
  })
);

// DELETE /api/events/:id - Delete event (NGO owner or admin only)
router.delete('/:id',
  authenticateToken,
  validateEventId,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const eventId = parseInt(req.params.id);
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check ownership
    if (req.user.role !== 'admin' && req.user.id !== event.ngo_id) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own events'
      });
    }

    const deleted = await Event.delete(eventId);

    if (!deleted) {
      return res.status(400).json({
        success: false,
        message: 'Failed to delete event'
      });
    }

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  })
);

// GET /api/events/ngo/:ngo_id - Get events by NGO
router.get('/ngo/:ngo_id',
  authenticateToken,
  asyncHandler(async (req, res) => {
    const ngoId = parseInt(req.params.ngo_id);

    // Check if user can view these events
    if (req.user.role !== 'admin' && req.user.id !== ngoId) {
      return res.status(403).json({
        success: false,
        message: 'You can only view your own NGO events'
      });
    }

    const events = await Event.findByNgo(ngoId);

    res.json({
      success: true,
      message: 'NGO events retrieved successfully',
      data: events,
      count: events.length
    });
  })
);

module.exports = router;
