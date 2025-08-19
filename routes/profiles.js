const express = require('express');
const router = express.Router();
const user = require('../models/user');
router.get("/addnew", (req, res) => {
    res.render("./profile.ejs")
})
router.post('/newprofile',  async (req, res) => {
    console.log (req.body)
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
module.exports = router