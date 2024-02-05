// routes/user.js

// routes/user.js

const express = require('express');
const UserController = require('../controllers/UserController');
const passport = require('passport');
const router = express.Router();
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'administrator') {
    return next();
  }
  res.status(403).json({ error: 'Access denied. Administrator privileges required.' });
};

// New route to get the current user's information
router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res) => {
  // The user information is available in req.user
  res.status(200).json({ message: 'Current user fetched successfully', data: { user: req.user } });
});

router.get('/:userId', passport.authenticate('jwt', { session: false }), UserController.getUserById);
router.put('/:userId/profile', passport.authenticate('jwt', { session: false }), UserController.updateProfile);
router.delete('/:userId', passport.authenticate('jwt', { session: false }), isAdmin, UserController.deleteUser);
router.get('/', passport.authenticate('jwt', { session: false }), isAdmin, UserController.getAllUsers);

module.exports = router;
