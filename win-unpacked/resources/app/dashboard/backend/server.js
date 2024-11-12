import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import helpdeskRoutes from './routes/helpdeskRoutes.js';
import insidenRoutes from './routes/insidenRoutes.js';

dotenv.config();  // Initialize dotenv to load environment variables

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware for JSON parsing and CORS
app.use(cors());
app.use(express.json());

// MongoDB connection using environment variables for the URI
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Users array to simulate a database for authentication (You can replace this with a real DB)
const users = [
  {
    id: 1,
    username: 'admin',
    password: bcrypt.hashSync('password', 10), // 'password' hashed for security
  },
];

// Middleware to authenticate using JWT token
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied, no token provided' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Login endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  // Find the user by username
  const user = users.find((u) => u.username === username);
  if (!user) return res.status(400).json({ message: 'User not found' });

  // Compare password
  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

  // Generate JWT token
  const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.json({ token });
});

// Use the routes for helpdesk tickets and incidents
app.use('/api/helpdesk-tickets', helpdeskRoutes); // Secure helpdesk routes with JWT authentication
app.use('/api/insidens', insidenRoutes); // Secure incident routes with JWT authentication

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
