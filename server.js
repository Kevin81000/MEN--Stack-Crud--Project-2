const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
//const Post = require('./models/Post');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const connectDB = require('./config/db');
const methodOverride = require('method-override');
const authMiddleware = require('./middleware/auth'); 

console.log('Checking modules...');
console.log('express:', !!require('express'));
console.log('mongoose:', !!require('mongoose'));
console.log('dotenv:', !!require('dotenv'));
console.log('cors:', !!require('cors'));
console.log('path:', !!require('path'));
console.log('express-session:', !!require('express-session'));
console.log('connect-mongo:', !!require('connect-mongo'));
 

const app = express();

// Load environment variables
dotenv.config();
const result = dotenv.config({ path: path.resolve(__dirname, '.env') });
if (result.error) {
  console.error('Error loading .env file:', result.error);
  process.exit(1);
}

console.log('dotenv parsed:', process.env);

// Validate environment variables
if (!process.env.MONGODB_URI) {
  console.error('Error: MONGO_URI is not defined in .env file');
  process.exit(1);
}
if (!process.env.SESSION_SECRET) {
  console.error('Error: SESSION_SECRET is not defined in .env file');
  process.exit(1);
}

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method')); // Enable method override for PUT/DELETE
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Session Setup
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: 'sessions',
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    },
  })
);

// Routes
const authRoute = require('./routes/auth.js');
app.use('/auth', authRoute);
const profileroutes = require('./routes/profiles.js'); 
app.use('/profiles', profileroutes); 
app.use('/api/posts', require('./routes/posts')); 
app.use('/api/contacts', require('./routes/contacts'));
app.use('/api/pages', require('./routes/pages'));

// Front-end Routes
app.get('/', (req, res) => res.render('index', { user: req.session.user || null }));
const postRoute = require('./routes/posts.js');
app.use('/dashboard', postRoute);
app.get('/contact', (req, res) => res.render('contact', { user: req.session.user || null }));
app.get('/create-post', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  res.render('create-post', { user: req.session.user });
});


// Blog Routes
app.get('/blog', async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'email');
    res.render('blog', { user: req.session.user || null, posts });
  } catch (err) {
    console.error('Error fetching posts:', err);
    res.render('blog', { user: req.session.user || null, posts: [] });
  }
});

app.get('/blog/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'email');
    if (!post) return res.status(404).render('404', { user: req.session.user || null, message: 'Post not found' });
    res.render('blog-post', { user: req.session.user || null, post });
  } catch (err) {
    console.error('Error fetching post:', err);
    res.status(500).render('404', { user: req.session.user || null, message: 'Server error' });
  }
});

app.get('/edit-post/:id', authMiddleware, async (req, res) => {
  try {
    // Validate id parameter
    if (!req.params.id || typeof req.params.id !== 'string') {
      throw new Error('Invalid post ID');
    }

    // Fetch the post
    const post = await Post.findById(req.params.id).populate('author', 'email');
    console.log('Fetched post:', post); // Debug log
    console.log('Session user', req.session.user);

    // Check if post exists
    if (!post) {
      return res.status(404).render('404', {
        user: req.session.user || null,
        message: 'The requested profile was not found.'
      });
    }


    // Render the edit form
    res.render('edit-post', { user: req.session.user, post });
  } catch (err) {
    console.error('Error fetching post for edit:', err.message || err);
    res.status(500).render('404', {
      user: req.session.user || null,
      message: 'An error occurred while loading the profile for editing.'
    });
  }
});
  

// Update Post Route (API style for consistency with routes/posts.js)
app.put('/api/posts/:id', authMiddleware, async (req, res) => {
  const { title, content, platform, contentType } = req.body;
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });
    
    post.title = title || post.title;
    post.content = content || post.content;
    post.platform = platform || post.platform;
    post.updatedAt = Date.now();
    await post.save();
    res.json(post);
  } catch (err) {
    console.error('Error updating post:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});