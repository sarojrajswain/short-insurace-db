const { AccountSchema } = require("./account");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");

const PolicyPreview = mongoose.model(
  "PolicyPreview",
  new mongoose.Schema({
    premium: {
      type: Number,
    },
    policy: {
      type: new mongoose.Schema({
        premium: {
          type: Number,
        },
        limit: {
          type: Number,
          required: true,
        },
        areYouStudent: {
          type: Boolean,
          required: true,
          default: false,
        },
        areYouPartOfRiderClub: {
          type: Boolean,
          required: true,
          default: false,
        },
        risk: {
          type: new mongoose.Schema({
            vehicleType: {
              type: String,
              required: true,
              default: "2W",
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
            premium: {
              type: Number,
            },
          }),
        },
      }),
    },
  })
);

function validateData(previewPolicy) {
  const schema = Joi.object({
    policy: Joi.object({
      premium: Joi.number(),
      limit: Joi.number().required(),
      areYouStudent: Joi.boolean(),
      areYouPartOfRiderClub: Joi.boolean(),
      risk: Joi.object({
        vehicleType: Joi.string().required(),
        make: Joi.string().required(),
        model: Joi.string().required(),
        year: Joi.number().required(),
        premium: Joi.number(),
      }),
    }),
  });

  return schema.validate(previewPolicy);
}

exports.PolicyPreview = PolicyPreview;
exports.quoteValidate = validateData;
