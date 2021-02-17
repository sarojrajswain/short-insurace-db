const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();
const { Data, validate } = require("../models/data");
/**
 * @swagger
 * components:
 *   schemas:
 *     Data:
 *       type: object
 *       required:
 *          - policyNumber
 *       properties:
 *         accountId: string
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
 *            risk:
 *              type: object
 *              properties:
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
 *         accountId: 6023dd2472bc86767c9f0009
 *         policy:
 *          effectiveDate: 2021-01-01
 *          expirationDate: 2022-01-01
 *          policyNumber: "2222"
 *          premium: 40000
 *          risk:
 *            make: toyota
 *            model: camry
 *            year: 2021
 *            color: black
 *            chacisNo: CHIS-001
 *            premium: 3499
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
  const records = await Data.find();
  res.send(records);
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
