const express = require('express');
const router = express.Router();
const User = require('../models/user');
const authMiddleware = require('../middleware/auth')
const Post = require('../models/Post');

router.get('/me', authMiddleware, async (req, res) => {
try {
    if (!req.user || !req.user._id) {
      return res.status(401).redirect('/auth/login');
    }
    const posts = await Post.find({ author: req.user._id }).populate('author', 'email');
    res.render('profiles', { user: req.user, posts, title: 'My Profiles' });
  } catch (err) {
    console.error('Error fetching profiles:', err);
    res.status(500).render('404', {
      user: req.user,
      message: 'Error loading profiles',
      title: 'Error'
    });
  }
});

router.get('/edit-profile/:id', authMiddleware, async (req, res) => {
  try {
    console.log('Attempting to edit profile with ID:', req.params.id);
    if (!req.params.id || typeof req.params.id !== 'string') {
      throw new Error('Invalid profile ID');
    }
    const post = await Post.findById(req.params.id).populate('author', 'email');
    console.log('Database query result:', post ? 'Found' : 'Not found', 'ID:', req.params.id);
    if (!post) {
      return res.status(404).render('404', {
        user: req.user,
        message: 'The requested profile was not found. ID: ' + req.params.id,
        title: 'Not Found'
      });
    }
    if (post.author && post.author._id.toString() !== req.user._id) {
      return res.status(403).render('404', {
        user: req.user,
        message: 'Unauthorized to edit this profile',
        title: 'Unauthorized'
      });
    }
    console.log('Rendering view:', 'edit-profile');
    res.render('edit-profile', { user: req.user, post, title: 'Edit Profile' });
  } catch (err) {
    console.error('Error fetching profile for edit:', err.message || err.stack);
    res.status(500).render('404', {
      user: req.user,
      message: 'An error occurred while loading the profile for editing. Error: ' + err.message,
      title: 'Error'
    });
  }
});

// Route to update a profile
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { title, platform, contentType, content } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Profile not found' });
    if (req.user._id && post.author && post.author.toString() !== req.user._id) {
      return res.status(403).json({ msg: 'Unauthorized to update this profile' });
    }
    post.title = title || post.title;
    post.platform = platform || post.platform;
    post.contentType = contentType || post.contentType;
    post.content = content || post.content;
    await post.save();
    res.redirect('/profiles/me'); // Redirect to profile page after update
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Route to render the add new profile form
router.get('/addnew', authMiddleware, (req, res) => {
  res.render('create-post', { user: req.user, post: null, title: 'Add New Profile' });
});

// Route to create a new profile
router.post('/addnew', authMiddleware, async (req, res) => {
  try {
    const { title, platform, contentType, content } = req.body;
    const post = new Post({
      title,
      platform,
      contentType,
      content,
      author: req.user._id
    });
    await post.save();
    res.redirect('/profiles/me');
  } catch (err) {
    console.error('Error creating profile:', err);
    res.status(500).render('create-post', {
      user: req.user,
      post: null,
      title: 'Add New Profile',
      error: 'Server error'
    });
  }
});

module.exports = router;

     
  
  


