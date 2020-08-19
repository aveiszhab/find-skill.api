const mongoose = require('mongoose');
const { validatePostcode, validateEmail } = require('../controllers/validators');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name required'],
  },
  postcode: {
    type: String,
    required: [true, 'Postcode required'],
    validate: [validatePostcode, 'Please enter a valid postcode.'],
  },
  skill: {
    type: String,
    required: [true, 'Skill required'],
  },
  description: {
    type: String,
    required: [true, 'Description required'],
  },
  free: {
    type: Boolean,
    required: [true, 'Is the service free?'],
  },
  professional: {
    type: Boolean,
    required: [true, 'Is the service professional?'],
  },
  email: {
    type: String,
    required: [true, 'Email required'],
    validate: [validateEmail, 'Please enter a valid email.'],
  },
  long: {
    type: String,
  },
  lat: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', userSchema);
