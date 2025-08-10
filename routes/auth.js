const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
router.get("/register",(req,res) => {
    res.render("./register.ejs")
})
router.post('/register', async (req, res) => {
    console.log(req.body)
  const { username, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    user = new User(req.body);
    await user.save();

    req.session.user = { id: user._id, email: user.email, role: user.role };
    res.redirect("/dashboard")
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.post('./login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    req.session.user = { id: user._id, email: user.email, role: user.role };
    res.json({ msg: 'Login successful' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.post('./logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ msg: 'Server error' });
    res.json({ msg: 'Logout successful' });
  });
});

module.exports = router;