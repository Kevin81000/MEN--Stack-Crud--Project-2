const express = require('express');
const router = express.Router();
const user = require('../models/user');
router.get("/addnew", (req, res) => {
    res.render("./profile.ejs")
})
module.exports = router