const mongoose = require('mongoose');

const geoCodeSchema = new mongoose.Schema({
  postcode: {
    type: String,
    required: true,
    unique: true,
  },
  lat: {
    type: String,
    required: true,
    default: true,
  },
  long: {
    type: String,
    required: true,
    default: false,
  },
});

module.exports = mongoose.model('GeoCoding', geoCodeSchema);
