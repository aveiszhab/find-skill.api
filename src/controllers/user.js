const User = require('../models/User');

exports.createUser = (req, res) => {
  User.create(req.body)
    .then(user => res.status(201).json(user));
};


exports.listUsers = (req, res) => {
  res.send({
    message: 'Hello world!',
  });
};
