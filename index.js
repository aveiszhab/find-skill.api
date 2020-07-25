/* eslint-disable no-console */
const app = require('./src/app');
const mongoose = require('mongoose');

const APP_PORT = process.env.PORT || 3000;

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

mongoose.connect(process.env.DB_CONNECTION, options, () => {
  app.listen(APP_PORT, () => {
    console.log(`Now serving your Express app at http://localhost:${APP_PORT}`);
  });
});
