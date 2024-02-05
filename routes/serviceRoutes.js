const express = require('express');
const router = express.Router();
const passport = require('passport');
const serviceController = require('../controllers/serviceController');

// Middleware to check if the user is an administrator
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'administrator') {
    return next();
  }
  res.status(403).json({ error: 'Access denied. Administrator privileges required.' });
};

// Apply isAdmin middleware to multiple routes
router.post('/create', passport.authenticate('jwt', { session: false }), isAdmin, serviceController.createService);
router.get('/:id', passport.authenticate('jwt', { session: false }), serviceController.getOneService);
router.get('/', passport.authenticate('jwt', { session: false }),  serviceController.getAllServices);
router.delete('/:id', passport.authenticate('jwt', { session: false }), isAdmin, serviceController.deleteService);

module.exports = router;
