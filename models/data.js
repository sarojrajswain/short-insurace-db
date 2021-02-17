const { AccountSchema } = require("./account");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");

const Data = mongoose.model(
  "Data",
  new mongoose.Schema({
    premium: {
      type: Number,
    },
    account: {
      type: new mongoose.Schema({
        _id: {
          type: String,
        },
      }),
      required: true,
    },
    policy: {
      type: new mongoose.Schema({
        effectiveDate: {
          type: Date,
          required: true,
        },
        expirationDate: {
          type: Date,
          required: true,
        },
        policyNumber: {
          type: String,
          required: true,
        },
        premium: {
          type: Number,
        },
        risk: {
          type: new mongoose.Schema({
            make: {
              type: String,
              required: true,
            },
            model: {
              type: String,
              required: true,
            },
            year: {
              type: String,
              required: true,
            },
            color: {
              type: String,
            },
            chacisNo: {
              type: String,
              required: true,
            },
            premium: {
              type: Number,
            },
          }),
        },
      }),
    },
  })
);

function validateData(data) {
  const schema = Joi.object({
    accountId: Joi.objectId(),
    policy: Joi.object({
      premium: Joi.number(),
      // accountId: Joi.objectId().required(),
      effectiveDate: Joi.date().required(),
      expirationDate: Joi.date().required(),
      policyNumber: Joi.string().required(),
      premium: Joi.number(),
      risk: Joi.object({
        make: Joi.string().required(),
        model: Joi.string().required(),
        year: Joi.number().required(),
        color: Joi.string().required(),
        chacisNo: Joi.string().required(),
        premium: Joi.number(),
      }),
    }),
  });

  return schema.validate(data);
}

exports.Data = Data;
exports.validate = validateData;
