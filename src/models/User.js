const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  industry: {
    type: String,
    required: true,
  },
  skill: {
    type: String,
    required: true,
  },
  professional: {
    type: Boolean,
    required: true,
    default: false,
  },
  free: {
    type: Boolean,
    required: true,
    default: true,
  },
  address: {
    type: String,
    required: true,
  },
  googleLatitude: {
    type: String,
    required: true,
  },
  googlelongitude: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', userSchema);
