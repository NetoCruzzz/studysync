// Import required modules
const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Import the User model (adjust path if needed)
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Registration route
router.post('/register', async (req, res) => {
  // 1. Extract data from the request body
  const { username, email, password } = req.body;

  // 2. Validate input fields
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  // 3. Check if a user with the same email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: 'Email already in use.' });
  }

  // 4. Hash the password for security
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // 5. Create and save the new user
  const newUser = new User({
    username,
    email,
    password: hashedPassword
  });
  await newUser.save();

  // 6. Send a success response
  res.status(201).json({ message: 'User registered successfully!' });
});

// Login Route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).json({ error: 'Invalid username or password.' });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ error: 'Invalid username or password.' });
  }
  const token = jwt.sign(
    { userId: user._id, username: user.username, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
  res.status(200).json({ message: 'Login successful', token });
});

// JWT verification middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token.' });
    req.user = user;
    next();
  });
}

// Protected route: Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// Export the router to be used in server.js
module.exports = router;