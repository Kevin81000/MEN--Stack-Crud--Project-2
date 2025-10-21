module.exports = (req, res, next) => {
  try {
    const sessionStatus = req.session ? 'Session exists' : 'No session';
    const sessionUser = req.session?.user || { _id: null, username: null };
    console.log('Auth check (no auth required):', sessionStatus, 'User:', {
      _id: sessionUser._id,
      username: sessionUser.username
    });

    req.user = req.session?.user
      ? { _id: req.session.user._id, username: req.session.user.username }
      : { _id: null, username: 'Guest' };

    next();
  } catch (err) {
    console.error(' Middleware error:', {
      message: err.message,
      stack: err.stack,
      url: req.originalUrl,
      session: req.session ? 'exists' : 'missing'
    });
    
    req.user = { _id: null, username: 'Guest' };
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      return res.status(500).json({
        msg: 'Server error',
        error: err.message,
        details: { session: !!req.session }
      });
    }
    next(); 
  }
};
