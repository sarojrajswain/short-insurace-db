const express = require("express");
const accounts = require("../routes/account");
const data = require("../routes/data");
const users = require("../routes/users");
const auth = require("../routes/auth");
const error = require("../middleware/error");
const cors = require("cors");

module.exports = function (app) {
  // app.use(function (req, res, next) {
  //   res.header("Access-Control-Allow-Origin", "*");
  //   res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  //   res.header("Access-Control-Allow-Headers", "Content-Type");
  //   next();
  // });

  app.use(cors());
  app.use(express.json());
  app.use("/api/accounts", accounts);
  app.use("/api/data", data);
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  app.use(error);
};;;
