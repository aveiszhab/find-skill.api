const User = require('../models/User')

exports.createUser = (req, res) => {
  User.create(req.body)
    .then(user => res.status(201).json(user));
    console.log(req.body)
};


exports.listUsers = (req, res) => {
  res.send({
    message: 'Hello world!',
  });
};
