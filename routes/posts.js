const express = require('express');
const router = express.Router();
const Post = require("../models/post");
 


const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

router.post('/', authMiddleware, async (req, res) => {
  const { title, content } = req.body;
  try {
    const post = new Post({ title, content, author: req.session.user.id });
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/', async (req, res) => { 
const posts = await Post.find().populate('author', 'email');
const user = (req.session.user)
      res.render("./dashboard.ejs",{posts, user});
  });

router.get('/:id', async (req, res) => { 
  try {
    const post = await Post.findById(req.params.id).populate('author', 'email');
    if (!post) return res.status(404).json({ msg: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => { // Fixed syntax
  const { title, content } = req.body;
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });
    if (post.author.toString() !== req.session.user.id && req.session.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    post.title = title || post.title;
    post.content = content || post.content;
    post.updatedAt = Date.now();
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
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