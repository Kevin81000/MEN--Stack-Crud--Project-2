const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: [100, 'Title cannot be longer than 100 characters'],
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true, 
});


postSchema.pre('findOneAndUpdate', function (next) {
  this.set({updateAt: Date.now() });
  next();
});


postSchema.methods.toJSON = function () {
  const post = this.toObject();
  post.id = post._id.toString();
  delete post._id;
  delete post.__v;
  return post;
};

const Post = mongoose.model('Post', postSchema);


console.log('Post model loaded successfully:', !!Post);

module.exports = Post;