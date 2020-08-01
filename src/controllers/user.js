const User = require('../models/User');
const GeoCoding = require('../models/Geocoding');
const { codePostcode } = require('./helper');


exports.createUser = async (req, res) => {
  const postcode = req.body.postcode;

  let isPostcode = await GeoCoding.findOne({ postcode: postcode }, 'postcode lat long', (err, location) => {
    if (err) return (err);
    return location;
  });

  if (!isPostcode) {
    isPostcode = await codePostcode(req.body.postcode);
  }

  const userData = await {
    name: req.body.name,
    postcode: req.body.postcode,
    skill: req.body.skill,
    description: req.body.description,
    free: req.body.free,
    professional: req.body.professional,
    email: req.body.email,
    long: isPostcode.long,
    lat: isPostcode.lat,
  };

  await User.create(userData, (err, user) => {
    if (err) {
      res.status(404).json({ error: 'The user could not be created.' });
    } else {
      res.status(201).json(user);
    }
  });
};


exports.listUsers = (req, res) => {
  res.send({
    message: 'Hello world!',
  });
};
