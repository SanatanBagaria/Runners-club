import express from 'express';
const router = express.Router();
import {
  getEvents,
  getEventById,
  createEvent,
  toggleRsvp,
  updateEvent, // Import updateEvent
  deleteEvent, // Import deleteEvent
} from '../controllers/eventController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

// Public route to get all events
router.get('/', getEvents);

// Private/Admin route to create an event
router.post('/', protect, admin, createEvent);

// --- ADD THIS ROUTE ---
// Private route for any logged-in user to RSVP
router.post('/:id/rsvp', protect, toggleRsvp);
// --------------------
router.get('/:id', getEventById);

router.put('/:id', protect, admin, updateEvent);

// Admin route to delete an event
router.delete('/:id', protect, admin, deleteEvent);

export default router;