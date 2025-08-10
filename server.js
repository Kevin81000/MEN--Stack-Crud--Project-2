const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const connectDB = require('./config/db');
console.log('Checking modules...');
console.log('express:', !!require('express'));
console.log('mongoose:', !!require('mongoose'));
console.log('dotenv:', !!require('dotenv'));
console.log('cors:', !!require('cors'));
console.log('path:', !!require('path'));
console.log('express-session:', !!require('express-session'));
console.log('connect-mongo:', !!require('connect-mongo'));
//console.log('connectDB:', !!require('/config/db'));
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
  console.error('Error: MONGODB_URI is not defined in .env file');
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
 const authRoute = require('./routes/auth.js')
// Routes
//app.use('/api/auth', require('./routes/auth'));
app.use("./auth",authRoute);
app.use('/api/posts', require('./routes/posts'));
app.use('/api/testimonials', require('./routes/testimonials'));
app.use('/api/contacts', require('./routes/contacts'));
app.use('/api/pages', require('./routes/pages'));

// Front-end Routes
app.get('/', (req, res) => res.render('index', { user: req.session.user || null }));
app.get('/dashboard', (req, res) => res.render('dashboard', { user: req.session.user || null }));
app.get('/blog', (req, res) => res.render('blog', { user: req.session.user || null }));
app.get('/contact', (req, res) => res.render('contact', { user: req.session.user || null }));
app.get('/blog/:id', (req, res) => res.render('blog-post', { user: req.session.user || null }));
app.get('/create-post', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  res.render('create-post', { user: req.session.user });
});
app.get('/login', (req, res) => res.render('login', { user: req.session.user || null }));
//app.get('/register', (req, res) => res.render('register', { user: req.session.user || null }));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});