const express = require('express');
const router = express.Router();

// In-memory feed array (replace with DB later)
let posts = [
  // Example post structure:
  // { id: 1, author: 'Alice', content: 'Hello!', comments: [{ id: 1, author: 'Bob', text: 'Hi!' }] }
];

// GET /api/feed - Get all posts
router.get('/', (req, res) => {
  res.json(posts);
});

// POST /api/feed - Add a new post
router.post('/', (req, res) => {
  const { author, content } = req.body;
  if (!author || !content) return res.status(400).json({ error: 'Author and content are required' });
  const newPost = {
    id: Date.now(),
    author,
    content,
    comments: []
  };
  posts.unshift(newPost); // Add to start for feed order
  res.status(201).json(newPost);
});

// POST /api/feed/:postId/comment - Add a comment to a post
router.post('/:postId/comment', (req, res) => {
  const postId = parseInt(req.params.postId, 10);
  const { author, text } = req.body;
  if (!author || !text) return res.status(400).json({ error: 'Author and text are required' });
  const post = posts.find(p => p.id === postId);
  if (!post) return res.status(404).json({ error: 'Post not found' });
  const newComment = {
    id: Date.now(),
    author,
    text
  };
  post.comments.push(newComment);
  res.status(201).json(newComment);
});

module.exports = router;
