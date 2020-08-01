const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  postcode: {
    type: String,
    required: true,
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
