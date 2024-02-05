// server/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  phonenumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
   
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'user', // Add roles as needed (e.g., 'admin', 'user')
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
