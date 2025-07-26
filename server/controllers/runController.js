import Run from '../models/Run.js';

// @desc    Create a new run log
// @route   POST /api/runs
// @access  Private
const createRun = async (req, res) => {
  const { date, distance, duration, notes } = req.body;

  if (!distance || !duration) {
    return res.status(400).json({ message: 'Distance and Duration are required' });
  }

  const run = new Run({
    date,
    distance,
    duration,
    notes,
    user: req.user._id, // From 'protect' middleware
  });

  const createdRun = await run.save();
  res.status(201).json(createdRun);
};

// @desc    Get logged-in user's runs
// @route   GET /api/runs/myruns
// @access  Private
const getMyRuns = async (req, res) => {
  const runs = await Run.find({ user: req.user._id }).sort({ date: -1 });
  res.json(runs);
};

// @desc    Delete a run
// @route   DELETE /api/runs/:id
// @access  Private
const deleteRun = async (req, res) => {
  const run = await Run.findById(req.params.id);

  if (!run) {
    return res.status(404).json({ message: 'Run not found' });
  }

  // Check if the run belongs to the user trying to delete it
  if (run.user.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  await Run.deleteOne({ _id: req.params.id });
  res.json({ message: 'Run removed' });
};

export { createRun, getMyRuns, deleteRun };