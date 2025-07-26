import express from 'express';
const router = express.Router();
import {
  registerUser,
  loginUser,
  getUsers,
  getPendingUsers, // Import
  approveUser,    // Import
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.post('/register', registerUser);
router.post('/login', loginUser);

// GET /api/users
router.get('/', protect, getUsers);

router.get('/pending', protect, admin, getPendingUsers);
router.put('/:id/approve', protect, admin, approveUser);

export default router;