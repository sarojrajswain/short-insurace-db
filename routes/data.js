const express = require("express");
const router = express.Router();
const { Data, validate } = require("../models/data");

router.get("/", async (req, res) => {
  const records = await Data.find();
  res.send(records);
});

router.get("/:policyNumber", async (req, res) => {
  const policy = await Data.findOne(
    {
      "policy.policyNumber": req.params.policyNumber,
    },
    "-_id -account"
  );

  res.send(policy);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let data = new Data({
    account: {
      _id: "6023dd2472bc86767c9f0009",
    },
    policy: {
      effectiveDate: req.body.policy.effectiveDate,
      expirationDate: req.body.policy.expirationDate,
      policyNumber: req.body.policy.policyNumber,
      premium: 33343,
      risk: {
        make: req.body.policy.risk.make,
        model: req.body.policy.risk.model,
        year: req.body.policy.risk.year,
        chacisNo: req.body.policy.risk.chacisNo,
        premium: 2000,
      },
    },
  });
  data
    .save()
    .then(function (result) {
      res.status(201).json({
        message: "Handling Data request to /data",
        createdDocument: result,
      });
    })
    .catch((err) => res.send(err));
  // data = await data.save();
  // res.send(data);
});

router.put("/:policyNumber", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const policy = await Data.findOneAndUpdate(
    {
      "policy.policyNumber": req.params.policyNumber,
    },
    {
      account: {
        _id: "6023dd2472bc86767c9f0009",
      },
      policy: {
        effectiveDate: req.body.policy.effectiveDate,
        expirationDate: req.body.policy.expirationDate,
        policyNumber: req.body.policy.policyNumber,
        premium: 33343,
        risk: {
          make: req.body.policy.risk.make,
          model: req.body.policy.risk.model,
          year: req.body.policy.risk.year,
          chacisNo: req.body.policy.risk.chacisNo,
          premium: 2000,
        },
      },
    },
    { new: true }
  );

  if (!policy)
    return res.status(400).send("No record found with given PolicyNumber");
  res.send(policy);
});

router.delete("/:policyNumber", async (req, res) => {
  const policy = await Data.findOne({
    "policy.policyNumber": req.params.policyNumber,
  });
  if (!policy)
    return res
      .status(400)
      .send(
        `Policy not found for the policyNumber: ${req.params.policyNumber}`
      );

  await policy.remove();
  res.json({
    message: "Policy Deleted sucessfully !",
    deletedDocument: policy,
  });
});

module.exports = router;
