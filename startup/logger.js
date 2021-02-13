const winston = require("winston");
const config = require("config");
require("winston-mongodb");
const { transports, createLogger, format, loggers } = require("winston");

const logger = createLogger({
  transports: [
    new transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
        winston.format.colorize(),
        winston.format.prettyPrint(),
        winston.format.simple()
      ),
    }),
    new transports.File({ filename: "error.log", level: "error" }),
    new transports.File({ filename: "combined.log" }),
    new transports.MongoDB({
      level: "info",
      db: config.get("db"),
      collection: "uncaught-exception",
    }),
  ],
});

logger.exceptions.handle(
  new transports.File({ filename: "uncaught-exceptions.log" }),
  new transports.Console({
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json(),
      winston.format.colorize(),
      winston.format.prettyPrint(),
      winston.format.simple()
    ),
  }),
  new transports.MongoDB({
    db: config.get("db"),
    collection: "uncaught-exception",
  })
);
process.on("unhandledRejection", (ex) => {
  throw ex;
});

module.exports = logger;
