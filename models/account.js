const Joi = require("Joi");
const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
    maxLength: 1,
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  postalCode: {
    type: Number,
    required: true,
  },
  driverLicense: {
    type: String,
    required: true,
  },
  phoneNo: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
});

const Account = mongoose.model("Account", accountSchema);

function ValidateAccount(Account) {
  const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    dateOfBirth: Joi.string().required(),
    gender: Joi.string().required(),
    address: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    postalCode: Joi.number().required(),
    driverLicense: Joi.string().required(),
    phoneNo: Joi.number().required(),
    email: Joi.string().email(),
  });
  return schema.validate(Account);
}
exports.Account = Account;
exports.AccountSchema = accountSchema;
exports.Validate = ValidateAccount;
