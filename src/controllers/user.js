const User = require('../models/User');
const GeoCoding = require('../models/Geocoding');
const { codePostcode } = require('./helper');


exports.createUser = async (req, res) => {
  const postcode = req.body.postcode;

  let isPostcode = await GeoCoding
    .findOne({ postcode: postcode }, 'postcode lat long', (err, location) => {
      if (err) return (err);
      return location;
    });

  if (!isPostcode) {
    isPostcode = await codePostcode(req.body.postcode)
      .catch((err) => {
        return (err);
      });
  }

  try {
    const userData = {
      name: req.body.name,
      postcode: isPostcode.postcode,
      skill: req.body.skill,
      description: req.body.description,
      free: req.body.free,
      professional: req.body.professional,
      email: req.body.email,
      long: isPostcode.long,
      lat: isPostcode.lat,
    };

    await User.create(userData, (err, user) => {
      if (user) {
        res.status(201).json(user);
      } else if (err.name === 'ValidationError') {
        res.status(404).json({ error: err.message });
      } else {
        res.status(404).json({ error: err });
      }
    });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
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
  let isPostcode;
  if (req.body.postcode) {
    isPostcode = await GeoCoding
      .findOne({ postcode: req.body.postcode }, 'postcode lat long', (err, location) => {
        if (err) return (err);
        return location;
      });

    if (!isPostcode) {
      isPostcode = await codePostcode(req.body.postcode)
        .catch((err) => {
          return (err);
        });
    }
  }
  let newLocation;
  if (isPostcode) {
    newLocation = {
      postcode: isPostcode.postcode,
      long: isPostcode.long,
      lat: isPostcode.lat,
    };
  } else {
    newLocation = {};
  }

  const userId = req.params.userId;
  const updatedFields = { ...req.body, ...newLocation };

  await User.findByIdAndUpdate(
    { _id: userId },
    { $set: updatedFields },
    { new: true, runValidators: true }
  )
    .exec((err, user) => {
      if (user) {
        res.status(200).json(user);
      } else if (err.name === 'ValidationError') {
        res.status(404).json({ error: err.message });
      } else {
        res.status(404).json({ error: 'The user could not be found.' });
      }
    });
};

exports.deleteUser = async (req, res) => {
  const userId = req.params.userId;

  await User.findByIdAndDelete(userId)

    .exec((err, user) => {
      if (err) {
        res.status(404).json({ error: 'The user could not be found.' });
      } else {
        res.status(204).json(user);
      }
    });
};
