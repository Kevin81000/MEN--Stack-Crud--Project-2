const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const authMiddleware = require('../middleware/auth');


router.get("/login", (req, res) => {
    res.render('login', { user: req.session.user || null, title: 'login'});
});
router.post('/login', async (req, res) => {
  try {
   const { username, password } = req.body;
   const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).render('login', {
        user: req.session.user || null, title: 'Login', error: 'Invalid username or password'});

    }
    req.session.user = { _id: user._id, username: user.username };
    req.redirect('/profiles/me');
   } catch (err) {
        console.error('Login error', err);
        res.status(500).render('login', {
        user: req.session.user || null,
      title: 'Login',
      error: 'Server error during login'
    });
  }
});  
        
  

router.get('/register', (req, res) => {
  res.render('register', { user: req.session.user || null, title: 'Register' });
});

router.post('/register', async (req, res) => {
try {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).render('register', {
        user: req.session.user || null,
        title: 'Register',
        error: 'Username already exists'
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    req.session.user = { _id: user._id, username: user.username };
    res.redirect('/profiles/me');
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).render('register', {
      user: req.session.user || null,
      title: 'Register',
      error: 'Server error during registration'
    });
  }
});
   





  router.get('/logout', authMiddleware, (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login');
  });
});
    
router.post('/logout', authMiddleware, (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ msg: 'Server error' });
        res.json({ msg: 'Logout successful' });
    });
});

module.exports = router;