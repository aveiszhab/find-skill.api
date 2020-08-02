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


exports.listUsers = async (req, res) => {
  const user = await User.find();
  res.status(200).json(user);
};

exports.getUserById = async (req, res) => {
  const userId = req.params.userId;

  await User.findById({ _id: userId }).exec((err, user) => {
    if (err) {
      res.status(404).json({ error: 'The user could not be found.' });
    } else {
      res.status(200).json(user);
    }
  });
};

exports.updateUser = async (req, res) => {
  const userId = req.params.userId;
  const updatedFields = req.body;

  await User.findByIdAndUpdate(
    { _id: userId },
    { $set: updatedFields },
    { new: true }
  )
    .exec((err, user) => {
      if (err) {
        res.status(404).json({ error: 'The user could not be found.' });
      } else {
        res.status(200).json(user);
      }
    });
};
