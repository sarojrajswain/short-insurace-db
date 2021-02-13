const logger = require("../config/logger");

module.exports = function (err, req, res, next) {
  //Log something
  //error
  //warn
  //info
  //verbose
  //debug
  //silly

  logger.info("info message");
  logger.log({ level: "error", message: err.message, err });

  res.status(500).send("something went wrong!");
};
