// Import required modules
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const PORT = 5000;

// Middleware to parse incoming JSON requests
app.use(express.json());

// Enable CORS for all routes
const cors = require('cors');
app.use(cors());

// Import authentication routes from the auth folder
const authRoutes = require('./auth'); // Adjust the path if needed

// Import tasks router
const tasksRouter = require('./tasks');

// Import feed router
const feedRouter = require('./auth/routes/feed');

// Mount the authentication routes at /api/auth
app.use('/api/auth', authRoutes);

// Mount the tasks routes at /api/tasks
app.use('/api/tasks', tasksRouter);

// Mount the feed routes at /api/feed
app.use('/api/feed', feedRouter);

// Default route for testing if the API is running
app.get('/', (req, res) => {
  res.send('StudySync API is running...');
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Connect to MongoDB using Mongoose
mongoose.connect('mongodb://localhost:27017/studysync')
  .then(() => console.log('MongoDB connected!'))
  .catch((err) => console.error('MongoDB connection error:', err));