const Joi = require("Joi");
const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
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
  gender: {
    type: String,
    required: true,
    maxLength: 1,
  },
  phone: {
    type: Number,
    required: true,
  },
  dlNumber: {
    type: String,
    required: true,
  },
  identificationNo: {
    type: String,
    required: true,
  },
});

const Account = mongoose.model("Account", accountSchema);

function ValidateAccount(Account) {
  const schema = Joi.object({
    name: Joi.string().required(),
    address: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    postalCode: Joi.number().required(),
    gender: Joi.string().required(),
    phone: Joi.number().required(),
    dlNumber: Joi.string().required(),
    identificationNo: Joi.string().required(),
  });
  return schema.validate(Account);
}
exports.Account = Account;
exports.AccountSchema = accountSchema;
exports.Validate = ValidateAccount;
