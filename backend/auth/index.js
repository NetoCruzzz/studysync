// Import required modules
const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Import the User model (adjust path if needed)
const bcrypt = require('bcrypt');

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

// Export the router to be used in server.js
module.exports = router;