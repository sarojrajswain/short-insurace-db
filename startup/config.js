const config = require("config");
require("dotenv").config();

module.exports = function () {
  if (!process.env.jwtPrivateKey) {
    throw new Error("Fatal Error : jwtPrivateKey is not defined!");
  }
};
