const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  platform: { type: String, required: true }, 
  contentType: { type: String, required: true }, 
  bio: { type: String },
});

module.exports = mongoose.model('Profile', profileSchema);