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
  },
  long: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('GeoCoding', geoCodeSchema);
