import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import bcrypt from 'bcryptjs';

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  if (user) {
    const token = generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: token,
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

// @desc    Auth user & get token (Login)
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    if (!user.isApproved) {
      return res.status(401).json({ message: 'Your account is pending admin approval.' });
    }
    const token = generateToken(res, user._id);
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: token,
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};
const getUsers = async (req, res) => {
  // Find all users and exclude their passwords from the result
  const users = await User.find({}).select('-password');
  res.json(users);
};
const getPendingUsers = async (req, res) => {
  const users = await User.find({ isApproved: false }).select('-password');
  res.json(users);
};
const approveUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.isApproved = true;
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isApproved: updatedUser.isApproved,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};
export {
  registerUser,
  loginUser,
  getUsers,
  getPendingUsers,
  approveUser,
};