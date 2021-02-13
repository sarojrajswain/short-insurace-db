const winston = require("winston");
const config = require("config");
require("express-async-errors");
require("winston-mongodb");

module.exports = function () {
  winston.exceptions.handle(
    new winston.transports.Console({
      handleExceptions: true,
      prettyPrint: true,
      colorize: true,
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.prettyPrint()
      ),
    }),
    new winston.transports.File({ filename: "uncaughtExceptions.log" }),
    new winston.transports.MongoDB({
      level: "info",
      db: config.get("db"),
      collection: "uncaught-exception",
    })
  );
  process.on("unhandledRejection", (ex) => {
    throw ex;
  });
};
