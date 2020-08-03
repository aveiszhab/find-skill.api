/* eslint-disable no-console */
const app = require('./src/app');
const dotenv = require('dotenv');
const connectDB = require('./db');


dotenv.config({ path: './.env' });

connectDB();

const APP_PORT = process.env.PORT || 4000;

app.listen(APP_PORT, () => {
  console.log(`Now serving your Express app at http://localhost:${APP_PORT}`);
});
