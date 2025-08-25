const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const authMiddleware = require('../middleware/auth');


router.get("/login", (req, res) => {
  res.render('login', { user: req.session.user || null, title: 'login', layout: false });
});
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Login attempt:', { username, password });
    const user = await User.findOne({ username });
    console.log('User found:', user);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).render('login', {
        user: req.session.user || null, title: 'Login', layout: false, error: 'Invalid username or password'
      });

    }
    req.session.user = { _id: user._id, username: user.username };
    res.redirect('/profiles');
  } catch (err) {
    console.error('Login error', err);
    res.status(500).render('login', {
      user: req.session.user || null,
      title: 'Login',
      layout: false,
      error: 'Server error during login'
    });
  }
});



router.get('/register', (req, res) => {
  res.render('register', { user: req.session.user || null, title: 'Register', layout: false });
});

router.post('/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;
    console.log('Registration attempt:', { username, password, email });
    const existingUser = await User.findOne({ username });
    console.log('Existing user check:', existingUser);
    if (existingUser) {
      return res.status(400).render('register', {
        user: req.session.user || null,
        title: 'Register',
        layout: false,
        error: 'Username already exists'
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, email });
    await user.save();
    req.session.user = { _id: user._id, username: user.username };
    console.log('Registration successful, session user:', req.session.user);
    res.redirect('/profiles/me');
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).render('register', {
      user: req.session.user || null,
      title: 'Register',
      layout: false,
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