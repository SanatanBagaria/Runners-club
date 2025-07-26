import mongoose from 'mongoose';

const runSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  distance: { // Storing distance in kilometers
    type: Number,
    required: true,
  },
  duration: { // Storing duration in minutes
    type: Number,
    required: true,
  },
  notes: {
    type: String,
    required: false,
  },
}, { timestamps: true });

const Run = mongoose.model('Run', runSchema);

export default Run;