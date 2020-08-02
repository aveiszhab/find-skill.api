const express = require('express');

const userController = require('../controllers/user');


const router = express.Router();

router
  .route('/')
  .post(userController.createUser)
  .get(userController.listUsers);

router
  .route('/:userId')
  .get(userController.getUserById);

module.exports = router;
