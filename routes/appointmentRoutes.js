const express = require('express');
const router = express.Router();
const passport = require('passport');
const appointmentController = require('../controllers/appointmentController');

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'administrator') {
    return next();
  }
  res.status(403).json({ error: 'Access denied. Administrator privileges required.' });
};

router.post('/book', passport.authenticate('jwt', { session: false }), appointmentController.bookAppointment);
router.get('/:id', passport.authenticate('jwt', { session: false }), appointmentController.getOneAppointment);
router.get('/', passport.authenticate('jwt', { session: false }), appointmentController.getAllAppointments);
router.put('/:id', passport.authenticate('jwt', { session: false }), isAdmin, appointmentController.updateAppointment);
router.delete('/:id', passport.authenticate('jwt', { session: false }), isAdmin, appointmentController.deleteAppointment);

module.exports = router;
