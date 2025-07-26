import express from 'express';
const router = express.Router();
import { createRun, getMyRuns, deleteRun } from '../controllers/runController.js';
import { protect } from '../middleware/authMiddleware.js';

// All routes here are protected
router.use(protect);

router.route('/')
  .post(createRun);

router.route('/myruns')
  .get(getMyRuns);

router.route('/:id')
  .delete(deleteRun);

export default router;