const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
      },
      specie: {
        type: String,
        required: true,
      },
      breed: {
        type: String,
        required: true,
      },
      age: {
        type: String,
        required: true,
      },
      gender: {
        type: String,
        required: true,
      },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  
});

const Pet = mongoose.model('Pet', petSchema);

module.exports = Pet;
