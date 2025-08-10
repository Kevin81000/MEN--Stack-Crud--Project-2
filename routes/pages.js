const express = require('express');
const router = express.Router();
const Page = require('../models/page');
const adminMiddleware = require('../middleware/admin');

router.post('/', adminMiddleware, async (req, res) => {
  const { title, content } = req.body;
  try {
    const page = new Page({ title, content });
    await page.save();
    res.json(page);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const pages = await Page.find();
    res.json(pages);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.put('/:id', adminMiddleware, async (req, res) => {
  const { title, content } = req.body;
  try {
    const page = await Page.findById(req.params.id);
    if (!page) return res.status(404).json({ msg: 'Page not found' });
    page.title = title || page.title;
    page.content = content || page.content;
    page.updatedAt = Date.now();
    await page.save();
    res.json(page);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.delete('/:id', adminMiddleware, async (req, res) => {
  try {
    const page = await Page.findById(req.params.id);
    if (!page) return res.status(404).json({ msg: 'Page not found' });
    await page.deleteOne();
    res.json({ msg: 'Page deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;