const express = require('express');
const router = express.Router();
const passport = require('passport');
const petController = require('../controllers/petController');

// Middleware to check if the user is an administrator
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'administrator') {
    return next();
  }
  res.status(403).json({ error: 'Access denied. Administrator privileges required.' });
};

// Apply isAdmin middleware to multiple routes
router.post('/create', passport.authenticate('jwt', { session: false }), petController.createPet);
router.get('/:id', passport.authenticate('jwt', { session: false }), petController.getOnePet);
router.get('/', passport.authenticate('jwt', { session: false }), petController.getAllPets);
router.delete('/:id', passport.authenticate('jwt', { session: false }), petController.deletePet);

module.exports = router;
