const config = require("config");

module.exports = function () {
  console.log("config");
  if (!config.get("jwtPrivateKey")) {
    throw new error("Fatal Error : jwtPrivateKey is not defined!");
  }
};
