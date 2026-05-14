const express = require('express');
const Group = require('../../models/Group');
const User = require('../../models/User');
const router = express.Router();

// Get all groups
router.get('/', async (req, res) => {
  const groups = await Group.find().populate('members', 'username email');
  res.json(groups);
});

// Create a new group
router.post('/', async (req, res) => {
  const { name, description, userId } = req.body;
  if (!name || !userId) return res.status(400).json({ error: 'Name and userId required' });
  try {
    const group = new Group({ name, description, members: [userId] });
    await group.save();
    res.status(201).json(group);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Join a group
router.post('/:groupId/join', async (req, res) => {
  const { userId } = req.body;
  const group = await Group.findById(req.params.groupId);
  if (!group) return res.status(404).json({ error: 'Group not found' });
  if (!group.members.includes(userId)) group.members.push(userId);
  await group.save();
  res.json(group);
});

// Add activity to group
router.post('/:groupId/activity', async (req, res) => {
  const { author, text } = req.body;
  const group = await Group.findById(req.params.groupId);
  if (!group) return res.status(404).json({ error: 'Group not found' });
  group.activity.push({ author, text });
  await group.save();
  res.json(group.activity[group.activity.length - 1]);
});

// Get group by ID
router.get('/:groupId', async (req, res) => {
  const group = await Group.findById(req.params.groupId).populate('members', 'username email');
  if (!group) return res.status(404).json({ error: 'Group not found' });
  res.json(group);
});

module.exports = router;
