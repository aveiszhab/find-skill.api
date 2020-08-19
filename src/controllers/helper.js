/* eslint-disable no-console */

const { Client } = require('@googlemaps/google-maps-services-js');
const GeoCoding = require('../models/Geocoding');

const codePostcode = async (postcode) => {
  const geocodingClient = new Client({});
  const params = {
    address: postcode,
    components: 'country:GB',
    key: process.env.GOOGLE_MAP_API_KEY,
  };
  const response = await geocodingClient.geocode({
    params: params,
  });
  if (response.data.status === 'ZERO_RESULTS') {
    throw new Error('Invalid geopostcode');
  } else {
    const result = response.data.results[0].geometry.location;

    const newLocation = {
      postcode: postcode,
      lat: result.lat,
      long: result.lng,
    };
    const location = await GeoCoding.create(newLocation);

    return location;
  }
};

module.exports = { codePostcode };
