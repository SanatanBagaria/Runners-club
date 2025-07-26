import mongoose from 'mongoose';

const eventSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  title: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true,
    default: 'Gandhi Maidan, Dhanbad',
  },
  distance: {
    type: String,
    required: true,
  },
  pace: {
    type: String,
    required: true,
  },
  // --- ADD THIS FIELD ---
  attendees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  routeUrl: {
    type: String,
    required: false, // This is optional
  },
  // --------------------
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);

export default Event;