const mongoose = require('mongoose');
const validatePostcode = require('../controllers/validators');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  postcode: {
    type: String,
    required: true,
    validate: [validatePostcode, 'Please enter a valid postcode.'],
  },
  skill: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  free: {
    type: Boolean,
    required: true,
    default: true,
  },
  professional: {
    type: Boolean,
    required: true,
    default: false,
  },
  email: {
    type: String,
    required: true,
  },
  long: {
    type: String,
    required: true,
  },
  lat: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', userSchema);
