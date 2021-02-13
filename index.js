const logger = require("./startup/logger");
const jwt = require("jsonwebtoken");
const config = require("config");
const winston = require("winston");
const express = require("express");
const app = express();

require("./startup/logging")();
require("./startup/routes")(app);
require("./startup/config")();
require("./startup/db")();

const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
  logger.log("info", `Listing on port ${port}...`);
});

module.exports = server;
