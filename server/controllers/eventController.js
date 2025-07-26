import Event from '../models/Event.js';

// @desc    Fetch all events
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res) => {
  const events = await Event.find({}).sort({ date: 1 });
  res.json(events);
};

// @desc    Create an event
// @route   POST /api/events
// @access  Private/Admin
const createEvent = async (req, res) => {
  const { title, date, location, distance, pace } = req.body;

  const event = new Event({
    title,
    date,
    location,
    distance,
    pace,
    user: req.user._id,
  });

  const createdEvent = await event.save();
  res.status(201).json(createdEvent);
};

const getEventById = async (req, res) => {
  const event = await Event.findById(req.params.id).populate(
    'attendees',
    'name'
  );
  if (event) {
    res.json(event);
  } else {
    res.status(404).json({ message: 'Event not found' });
  }
};


// @desc    Toggle RSVP status for an event
// @route   POST /api/events/:id/rsvp
// @access  Private
const toggleRsvp = async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (event) {
    const userId = req.user._id;
    const alreadyAttending = event.attendees.find(
      (attendeeId) => attendeeId.toString() === userId.toString()
    );

    if (alreadyAttending) {
      // User is already attending, so remove them (un-RSVP)
      event.attendees = event.attendees.filter(
        (attendeeId) => attendeeId.toString() !== userId.toString()
      );
    } else {
      // User is not attending, so add them
      event.attendees.push(userId);
    }

    const updatedEvent = await event.save();
    res.json(updatedEvent);
  } else {
    res.status(404).json({ message: 'Event not found' });
  }
};


const updateEvent = async (req, res) => {
  const { title, date, location, distance, pace, routeUrl } = req.body;
  const event = await Event.findById(req.params.id);

  if (!event) {
    return res.status(404).json({ message: 'Event not found' });
  }

  // --- Security Check ---
  // Ensure the user updating the event is the one who created it.
  if (event.user.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: 'User not authorized' });
  }

  event.title = title || event.title;
  event.date = date || event.date;
  event.location = location || event.location;
  event.distance = distance || event.distance;
  event.pace = pace || event.pace;
  event.routeUrl = routeUrl || event.routeUrl;

  const updatedEvent = await event.save();
  res.json(updatedEvent);
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private/Admin
const deleteEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    return res.status(404).json({ message: 'Event not found' });
  }

  // --- Security Check ---
  if (event.user.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: 'User not authorized' });
  }

  await Event.deleteOne({ _id: req.params.id });
  res.json({ message: 'Event removed successfully' });
};

// --- Update the exports ---
export {
  getEvents,
  getEventById,
  createEvent,
  toggleRsvp,
  updateEvent,
  deleteEvent,
};