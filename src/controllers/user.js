const User = require('../models/User');
const GeoCoding = require('../models/Geocoding');
const { codePostcode } = require('./helper');


exports.createUser = async (req, res) => {
  const postcode = req.body.postcode;

  const postcodeExists = await GeoCoding.findOne({ postcode: postcode }, 'postcode lat long', (err, location) => {
    if (err) return (err);
    return location;
  });
  console.log(`postcodeExists: ${ postcodeExists}`);
  if (!postcodeExists) {
    const codingResult = await codePostcode(req.body.postcode);
    console.log('codingResult' + codingResult)
    return codingResult;
  }

  const codedPostcode = await GeoCoding.findOne({ postcode: postcode }, 'postcode lat long', (err, location) => {
    if (err) return (err);
    return location;
  });
  console.log(`codedPostcode: ${ codedPostcode}`);

  const userData = await {
    name: req.body.name,
    postcode: req.body.postcode,
    skill: req.body.skill,
    description: req.body.description,
    free: req.body.free,
    professional: req.body.professional,
    long: codedPostcode.long,
    lat: codedPostcode.lat,
  };
  console.log(`userData: ${ userData.long}`);

  await User.create(userData, function (err, small) {
    if (err) console.log(err);
    res.status(201).json(small);
  });
};


exports.listUsers = (req, res) => {
  res.send({
    message: 'Hello world!',
  });
};
