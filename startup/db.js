const mongoose = require("mongoose");
const config = require("config");
const logger = require("./logger");

module.exports = function () {
  console.log("db");
  const db = config.get("db");
  mongoose.connect(db).then(() => logger.log("info", `Connecting to ${db}...`));
};
