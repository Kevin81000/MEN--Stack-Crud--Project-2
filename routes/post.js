const express = require('express');
const router = express.Router();
const post = require("../models/Post");
const authMiddleware = require('../middleware/auth');


router.post('/', authMiddleware, async (req, res) => {
  const { title, content, platform, contentType } = req.body;
  try {
    if (!title || !content) {
      return res.status(400).json({ msg: 'Title and content required' });
    }
    const post = new Post({ title, content, author: req.session.user.id });
    await post.save();
    res.json(post);
  } catch (err) {
    console.error('Error creating post:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/', async (req, res) => {
  const posts = await post.find().populate('author', 'email');
  const user = (req.session.user)
  res.render("./dashboard.ejs", { posts, user });
});

router.put('/:id', authMiddleware, async (req, res) => {
  const { title, content, platform, contentType } = req.body;
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });

    post.title = title || post.title;
    post.content = content || post.content;
    post.platform = platform || post.platform;
    post.contentType = contentType || post.contentType;
    post.updatedAt = Date.now();
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});




router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const post = await post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });
    if (post.author.toString() !== req.session.user.id && req.session.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await post.deleteOne();
    res.json({ msg: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;