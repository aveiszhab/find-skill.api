/* eslint-disable no-console */

const { Client } = require('@googlemaps/google-maps-services-js');
const GeoCoding = require('../models/Geocoding');

const codePostcode = (postcode) => {
  const geocodingClient = new Client({});
  const params = {
    address: postcode,
    components: 'country:GB',
    key: process.env.GOOGLE_MAP_API_KEY,
  };

  console.log(`retrieving lat, lng for ${ params.address}`);
  geocodingClient.geocode({
    params: params,
  })
    .then((response) => {
      console.log(response.data.results[0].geometry.location);
      return response.data.results[0].geometry.location;
    })
    .then((result) => {
      console.log(`result${ result.lat}`);
      const newLocation = {
        postcode: postcode,
        lat: result.lat,
        long: result.lng,
      };
      console.log(`newLocation:${ newLocation.postcode}`);
      GeoCoding.create(newLocation, function (err, data) {
        if (err) console.log(err);
        console.log('data:' +data);
        return data;
      });
    })
    .catch((error) => {
      console.log(error);
    });
};


module.exports = { codePostcode };
