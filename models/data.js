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
        name:   {
          type: String,
          required:   true,
        },
      }),
      required: true,
    },
    policy: {
      type: new mongoose.Schema({
        effectiveDate: {
          type: String,
          required: true,
        },
        expirationDate: {
          type: String,
          required: true,
        },
        policyNumber: {
          type: String,
          required: true,
        },
        premium: {
          type: Number,
        },
        limit: {
          type: Number,
          required: true,
        },
        partOfRiderClub: {
          type: Boolean,
          required: true,
        },
        areYouStudent: {
          type: Boolean,
          required: true,
        },
        acceptTerms:{
          type: Boolean,
          required: true,
        },
        risk: {
          type: new mongoose.Schema({
            vehicleType: {
              type: String,
              required: true,
            },
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
    accountId: Joi.objectId().required(),
    policy: Joi.object({
      premium: Joi.number(),
      acceptTerms: Joi.boolean(),
      effectiveDate: Joi.string().required(),
      expirationDate: Joi.string().required(),
      policyNumber: Joi.string().required(),
      premium: Joi.number(),
      limit: Joi.number().required(),
      areYouStudent: Joi.boolean(),
      partOfRiderClub: Joi.boolean(),
      risk: Joi.object({
        vehicleType: Joi.string().required(),
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
