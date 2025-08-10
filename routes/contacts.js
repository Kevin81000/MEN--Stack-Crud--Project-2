const express = require('express');
const router = express.Router();
const Contact = require('../models/contact');

router.post('/', async (req, res) => {
  const { name, email, subject, message } = req.body;
  try {
    const contact = new Contact({ name, email, subject, message });
    await contact.save();
    res.json({ msg: 'Contact form submitted successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;