const express = require('express');
const router = express.Router();
const Testimonial = require('../models/testimonial');
const adminMiddleware = require('../middleware/admin');

router.post('/', adminMiddleware, async (req, res) => {
  const { content, author } = req.body;
  try {
    const testimonial = new Testimonial({ content, author });
    await testimonial.save();
    res.json(testimonial);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const testimonials = await Testimonial.find();
    res.json(testimonials);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.delete('/:id', adminMiddleware, async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) return res.status(404).json({ msg: 'Testimonial not found' });
    await testimonial.deleteOne();
    res.json({ msg: 'Testimonial deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;