
// server/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/config');
exports.signUp = async (req, res) => {
  try {
    const { firstname, lastname, username, phonenumber, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const adminExists = await User.findOne({ role: 'administrator' });

    if (!adminExists) {
      // Create a new administrator user by default
      const adminUser = new User({
        firstname: 'Admin',
        lastname: 'User',
        username: 'admin',
        phonenumber: '070000000',
        email: 'admin@gmail.com',
        password: await bcrypt.hash('admin', 10),
        role: 'administrator',
      });

      // Save the administrator user to the database
      await adminUser.save();
    }

    const newUser = new User({ firstname, lastname, username,  phonenumber, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw new Error('User not found');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error('Invalid password');

    const token = jwt.sign({ userId: user._id, role: user.role }, config.secret, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};
