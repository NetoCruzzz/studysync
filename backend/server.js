const mongoose = require('mongoose');
const express = require('express');
const app = express();
const PORT = 5000;

app.get('/', (req, res) => {
  res.send('StudySync API is running...');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/studysync')
.then(() => console.log('MongoDB connected!'))
.catch((err) => console.error('MongoDB connection error:', err));