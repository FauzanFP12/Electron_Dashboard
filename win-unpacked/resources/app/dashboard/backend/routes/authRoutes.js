import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';  // User model
import dotenv from 'dotenv';

dotenv.config();  // Load environment variables from .env file

const router = express.Router();

// Login endpoint
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    console.log('Login attempt for username:', username);

    // Normalize username to lowercase for case-insensitive comparison
    const user = await User.findOne({ username: username.toLowerCase() });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Debugging: Check stored password hash and entered password
    console.log('Entered Password:', password);
    console.log('Stored Password Hash:', user.password);

    // Compare password
    const isMatch = await user.isPasswordMatch(password);

    console.log('Password match result:', isMatch);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '3h' } // Token expires in 3 hours
    );

    console.log('Generated Token:', token);

    // Send token in response
    res.json({ token });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Register endpoint (for normal users)
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    // Normalize username to lowercase
    const normalizedUsername = username.toLowerCase();

    // Check if user with the given username already exists
    const existingUser = await User.findOne({ username: normalizedUsername });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save new user to database
    const newUser = new User({
      username: normalizedUsername,
      password: hashedPassword
    });
    await newUser.save();

    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});



// Register Admin (used only once for the first admin user creation)
router.post('/register-admin', async (req, res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    // Normalize username to lowercase
    const normalizedUsername = username.toLowerCase();

    // Check if admin user already exists
    const adminUser = await User.findOne({ username: 'admin' });
    if (adminUser) {
      return res.status(400).json({ message: 'Admin user already exists' });
    }

    // Check if user with the same username already exists
    const existingUser = await User.findOne({ username: normalizedUsername });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin user
    const newUser = new User({
      username: normalizedUsername,
      password: hashedPassword
    });

    await newUser.save();

    res.status(201).json({ message: 'Admin user created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
