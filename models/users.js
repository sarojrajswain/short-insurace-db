const config = require("config");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Joi = require("joi");
const { bool } = require("joi");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 50,
  },
  email: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 1024,
  },
  isAdmin: {
    type: Boolean,
  },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.get("jwtPrivateKey")
  );
  return token;
};

const User = mongoose.model("User", userSchema);

function validateUser(req) {
  const schema = Joi.object({
    isAdmin: Joi.boolean(),
    name: Joi.string().required().min(5).max(50),
    password: Joi.string().required().min(5).max(255),
    email: Joi.string().required().min(5).max(255).email(),
  });

  return schema.validate(req);
}

exports.User = User;
exports.validate = validateUser;
