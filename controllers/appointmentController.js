const Appointment = require('../models/Appointment');

exports.bookAppointment = async (req, res) => {
  const { date, time, serviceId, petId } = req.body;
  const userId = req.user._id;

  try {
    // Ensure that all required fields are present
    if (!userId || !serviceId || !petId || !date || !time) {
      return res.status(400).json({ error: 'Missing required fields for appointment booking' });
    }

    const appointment = new Appointment({
      user: userId,
      serviceId,
      petId,
      date,
      time,
    });

    await appointment.save();

    res.json({ message: 'Appointment booked successfully!', appointment });
  } catch (error) {
    console.error('Error booking appointment:', error);
    // Log the specific error for debugging purposes
    res.status(500).json({ error: `Internal Server Error: ${error.message}` });
  }
};

exports.getAllAppointments = async (req, res) => {
  try {
    const isAdmin = req.user.role === 'administrator';
    let appointments;
    if (isAdmin) {
      appointments = await Appointment.find();
    } else {
      appointments = await Appointment.find({ user: req.user._id });
    }

    res.status(200).json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getOneAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check if the appointment belongs to the current user
    if (appointment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied. This appointment does not belong to the current user' });
    }

    res.status(200).json(appointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const { status } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.status(200).json({ message: 'Appointment updated successfully', appointment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.deleteAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const deletedAppointment = await Appointment.findByIdAndDelete(appointmentId);

    if (!deletedAppointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check if the appointment belongs to the current user
    if (deletedAppointment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied. This appointment does not belong to the current user' });
    }

    res.status(200).json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
