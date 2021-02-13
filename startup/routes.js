const express = require("express");
const accounts = require("../routes/account");
const data = require("../routes/data");
const users = require("../routes/users");
const auth = require("../routes/auth");
const error = require("../middleware/error");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/accounts", accounts);
  app.use("/api/data", data);
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  app.use(error);
};
