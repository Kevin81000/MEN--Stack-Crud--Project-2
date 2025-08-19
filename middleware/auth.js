const authMiddleware = (req, res, next) => {
  if (!req.session.user || !req.session.user.user._id) {
    return res.redirect('/login');
  }
  next();
};
module.exports = (req, res, next) => {
  if (!req.session.user || !req.session.user._id) return res.redirect('/login');
  next();
};
module.exports = authMiddleware;