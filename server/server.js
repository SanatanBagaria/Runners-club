// Import required packages
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import runRoutes from './routes/runRoutes.js';

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
const allowedOrigins = [
  'https://runners-club-2o8fv04iw-sanatan-bagarias-projects.vercel.app',
  'https://runners-club-n6e4ajxig-sanatan-bagarias-projects.vercel.app',
  'http://localhost:5173',
  'https://runners-club.vercel.app/', // Optional: keep for local dev
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true // If you use cookies/auth headers
}));
app.use(express.json()); // To parse JSON request bodies

// A simple test route
app.get('/', (req, res) => {
  res.send('WebD Running Club API is running...');
});

// Use API routes
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/runs', runRoutes);

// Define the port
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));