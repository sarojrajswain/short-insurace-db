const auth = require("../middleware/auth");
const currencyFormatter = require("currency-formatter");
const express = require("express");
const router = express.Router();
const { Data, validate } = require("../models/data");
const { PolicyPreview, quoteValidate } = require("../models/previewPolicy");
const { AccountSchema, Account } = require("../models/account");
const _ = require('lodash')
/**
 * @swagger
 * components:
 *   schemas:
 *     Data:
 *       type: object
 *       required:
 *          - policyNumber
 *       properties:
 *         accountId: 
 *          type: string
 *         policy:
 *          type: object
 *          properties:
 *            effectiveDate:
 *              type: date
 *            expirationDate:
 *              type: date
 *            policyNumber:
 *              type: string
 *            premium:
 *              type: number
 *            limit:
 *              type: number
 *            partOfRiderClub:
 *              type: boolean
 *            areYouStudent:
 *              type: boolean
 *            acceptTerms:
 *              type: boolean
 *            risk:
 *              type: object
 *              properties:
 *                vehicleType:
 *                  type: string
 *                make:
 *                  type: string
 *                model:
 *                  type: string
 *                year:
 *                  type: number
 *                color:
 *                  type: string
 *                chacisNo:
 *                  type: string
 *                premium:
 *                  type: number
 *       example:
 *         accountId: "6023dd2472bc86767c9f0009"
 *         policy:
 *          effectiveDate: 2021-01-01
 *          expirationDate: 2022-01-01
 *          policyNumber: "2222"
 *          premium: 40000
 *          limit: 2000
 *          areYouStudent: true
 *          partOfRiderClub: true
 *          acceptTerms: true
 *          risk:
 *            vehicleType: 2W
 *            make: toyota
 *            model: camry
 *            year: 2021
 *            color: black
 *            chacisNo: CHIS-001
 *            premium: 3499
 *     Quote:
 *       type: object
 *       properties:
 *         policy:
 *          type: object
 *          properties:
 *            premium:
 *              type: number
 *            limit:
 *              type: number
 *            areYouStudent:
 *              type: boolean
 *            areYouPartOfRiderClub:
 *              type: boolean
 *            risk:
 *              type: object
 *              properties:
 *                vehicleType:
 *                  type: string
 *                make:
 *                  type: string
 *                model:
 *                  type: string
 *                year:
 *                  type: number
 *                premium:
 *                  type: number
 *       example:
 *         policy:
 *          limit: 5000
 *          areYouStudent: false
 *          riderClub: false
 *          risk:
 *            vehicleType: 2W
 *            make: toyota
 *            model: camry
 *            year: 2021
 *            color: black
 *            chacisNo: CHIS-001
 */

/**
 * @swagger
 * tags:
 *   name: Policy
 *   description: The Data Manging API
 */

/**
 * @swagger
 * /api/data:
 *  get:
 *    summary: returns the list of all policy documents
 *    tags: [Policy]
 *    responses:
 *      200:
 *        description: Policy was created
 *        content:
 *          application/json:
 *            schems:
 *              $ref: '#components/schemas/Data'
 *      500:
 *        description: something went wrong
 */

router.get("/", auth, async (req, res) => {
  if (Object.keys(req.query).length === 0) {
    const records = await Data.find();
    res.send(records);
  } else {
    const key = _.keys(req.query)[0];
    const value = _.values(req.query)[0];
    const data = await Data.findOne({ [key]: value });
    res.send(data);
  }
});

/**
 * @swagger
 * /api/data/{policyNumber}:
 *   get:
 *     summary: Get the policy by policyNumber
 *     tags: [Policy]
 *     parameters:
 *       - in: path
 *         name: policyNumber
 *         schema:
 *           type: string
 *         required: true
 *         description: The policyNumber
 *     responses:
 *       200:
 *         description: The pol description by policyNumber
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Data'
 *       404:
 *         description: The policyNumber was not found
 */
router.get("/:policyNumber", auth, async (req, res) => {
  const policy = await Data.findOne(
    {
      "policy.policyNumber": req.params.policyNumber,
    },
    "-_id -account"
  );

  res.send(policy);
});

/**
 * @swagger
 * /api/data/quotePreview:
 *  post:
 *    summary: Quote Preview
 *    tags: [Policy]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *              $ref: '#components/schemas/Quote'
 *    responses:
 *      200:
 *        description: Preview Quote is available
 *        content:
 *          application/json:
 *            schems:
 *              $ref: '#components/schemas/Quote'
 *      500:
 *        description: something went wrong
 */
router.post("/quotePreview", async (req, res) => {
  console.log(req.body);
  const { error } = quoteValidate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let policyPreview = new PolicyPreview({
    policy: {
      premium: req.body.policy.limit * 0.2,
      limit: req.body.policy.limit,
      areYouStudent: req.body.policy.areYouStudent,
      areYouPartOfRiderClub: req.body.policy.areYouPartOfRiderClub,
      risk: {
        vechicleType: req.body.policy.risk.vechicleType,
        make: req.body.policy.risk.make,
        model: req.body.policy.risk.model,
        year: req.body.policy.risk.year,
        premium: req.body.policy.limit * 0.2,
      },
    },
  });
  policyPreview
    .save()
    .then(function (result) {
      res.status(201).json({
        message: "Handling Data request to /quotePreview",
        "expected Premium Amount": currencyFormatter.format(
          result.policy.premium,
          { code: "INR" }
        ),
      });
    })
    .catch((err) => res.send(err));
});
/**
 * @swagger
 * /api/data:
 *  post:
 *    summary: Create a new Policy Document
 *    tags: [Policy]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *              $ref: '#components/schemas/Data'
 *    responses:
 *      200:
 *        description: Policy was created
 *        content:
 *          application/json:
 *            schems:
 *              $ref: '#components/schemas/Data'
 *      500:
 *        description: something went wrong
 */

router.post("/", auth, async (req, res) => {
  console.log(req.body);
  
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  
  const account = await Account.findOne({_id:req.body.accountId});
  
    let data = new Data({
      account: {
        _id: account._id,
        name: account.firstName,
      },
      policy: {
        effectiveDate: req.body.policy.effectiveDate,
        expirationDate: req.body.policy.expirationDate,
        policyNumber: req.body.policy.policyNumber,
        premium: 33343,
        limit: req.body.policy.limit,
        areYouStudent: req.body.policy.areYouStudent,
        partOfRiderClub: req.body.policy.partOfRiderClub,
        acceptTerms: req.body.policy.acceptTerms,
        risk: {
          vehicleType:  req.body.policy.risk.vehicleType,
          make: req.body.policy.risk.make,
          model: req.body.policy.risk.model,
          year: req.body.policy.risk.year,
          chacisNo: req.body.policy.risk.chacisNo,
          color: req.body.policy.risk.color,
          premium: 2000,
        },
      },
    });  
  

  console.log("data:")
  console.log(data);
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

/**
 * @swagger
 * /api/data/{policyNumber}:
 *  put:
 *    summary: Update an existing policy Document
 *    tags: [Policy]
 *    parameters:
 *      - in: path
 *        name: policyNumber
 *        schema:
 *          type: string
 *        required: true
 *        description: The PolicyNumber
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *              $ref: '#components/schemas/Data'
 *    responses:
 *      200:
 *        description: Policy was updated
 *        content:
 *          application/json:
 *            schems:
 *              $ref: '#components/schemas/Data'
 *      500:
 *        description: something went wrong
 */
router.put("/:policyNumber", auth, async (req, res) => {
  console.log(req.user._id, ":" + req.body.accountId);
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const policy = await Data.findOneAndUpdate(
    {
      "policy.policyNumber": req.params.policyNumber,
    },
    {
      account: {
        _id: req.user._id,
      },
      policy: {
        effectiveDate: req.body.policy.effectiveDate,
        expirationDate: req.body.policy.expirationDate,
        policyNumber: req.body.policy.policyNumber,
        premium: req.body.policy.premium,
        limit: req.body.policy.limit,
        areYouStudent: req.body.policy.areYouStudent,
        partOfRiderClub: req.body.policy.partOfRiderClub,
        risk: {
          vehicleType:  req.body.policy.risk.vehicleType,
          make: req.body.policy.risk.make,
          model: req.body.policy.risk.model,
          year: req.body.policy.risk.year,
          chacisNo: req.body.policy.risk.chacisNo,
          color: req.body.policy.risk.color,
          premium: req.body.policy.risk.premium,
        },
      },
    },
    { new: true }
  );

  if (!policy)
    return res.status(400).send("No record found with given PolicyNumber");
  res.send(policy);
});

/**
 * @swagger
 * /api/data/{policyNumber}:
 *   delete:
 *     summary: Remove the policyDocument by policyNumber
 *     tags: [Policy]
 *     parameters:
 *       - in: path
 *         name: policyNumber
 *         schema:
 *           type: string
 *         required: true
 *         description: PolicyNumber
 *
 *     responses:
 *       200:
 *         description: The policy was deleted
 *       404:
 *         description: The policy was not found
 */

router.delete("/:policyNumber", auth, async (req, res) => {
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
