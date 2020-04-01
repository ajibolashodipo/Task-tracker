// config.js
const dotenv = require("dotenv");
dotenv.config();
module.exports = {
  envPort: process.env.PORT,
  databaseURL: process.env.DATABASEURL
};
