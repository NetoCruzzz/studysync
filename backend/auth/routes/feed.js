const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');

// GET /api/feed - Get all posts
router.get('/', async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.json(posts);
});

// POST /api/feed - Add a new post
router.post('/', async (req, res) => {
  const { author, content } = req.body;
  if (!author || !content) return res.status(400).json({ error: 'Author and content are required' });
  const newPost = new Post({ author, content });
  await newPost.save();
  res.status(201).json(newPost);
});

// POST /api/feed/:postId/comment - Add a comment to a post
router.post('/:postId/comment', async (req, res) => {
  const { postId } = req.params;
  const { author, text } = req.body;
  if (!author || !text) return res.status(400).json({ error: 'Author and text are required' });
  const post = await Post.findById(postId);
  if (!post) return res.status(404).json({ error: 'Post not found' });
  const newComment = { author, text };
  post.comments.push(newComment);
  await post.save();
  res.status(201).json(post.comments[post.comments.length - 1]);
});

module.exports = router;
