const admin = require("../middleware/admin");
const auth = require("../middleware/auth");
const { Account, Validate } = require("../models/account");
const { User } = require("../models/users");
const express = require("express");
const { json } = require("express");
const router = express.Router();
const _ = require("lodash");
const { query } = require("../startup/logger");
/**
 * @swagger
 * components:
 *    schemas:
 *     Account:
 *       type: object
 *       required:
 *          - firstName
 *          - lastName
 *          - dateOfBirth
 *          - gender
 *          - address
 *          - city
 *          - state
 *          - postalCode
 *          - driverLicense
 *          - phoneNo
 *          - email
 *       properties:
 *         firstName:
 *           type: string
 *           description: First Name of the Account
 *         lastName:
 *           type: string
 *           description: Last Name of the Account
 *         dateOfBirth:
 *           type: string
 *           description: Date of Birth
 *         gender:
 *           type: string
 *           description: Gender
 *         address:
 *           type: string
 *           description: Street address
 *         city:
 *           type: string
 *           description: City
 *         state:
 *           type: string
 *           description: State
 *         postalCode:
 *           type: number
 *           description: Zip/Postal Code
 *         driverLicense:
 *           type: number
 *           description: Driver LicenseNumber
 *         phoneNo:
 *           type: string
 *           description: Phone Number
 *         email:
 *           type: string
 *           description: Email Address
 *       example:
 *         firstName: Saroj Raj
 *         lastName: Swain
 *         dateOfBirth: 01/01/1980
 *         gender: M
 *         address: 2521 Forest Haven BLVD
 *         city: Bhubaneswar
 *         state: Odisha
 *         postalCode: 02839
 *         driverLicense: DL-001-OD
 *         phoneNo: 1234567890
 *         email: sarojrajswain@gmail.com
 */

/**
 * @swagger
 * tags:
 *   name: Accounts
 *   description: The Account Manging API
 */
/**
 * @swagger
 * /api/accounts:
 *  get:
 *    summary: returns the list of all Account Holders
 *    tags: [Accounts]
 *    parameters:
 *       - in: query
 *         name: params
 *         schema:
 *           type: object
 *           additionalProperties:
 *             type: string
 *    responses:
 *      200:
 *        description: the lis of Account holders
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#components/schemas/Account'
 *
 */

router.get("/", async (req, res) => {
  if (req.query) {
    const key = _.keys(req.query)[0];
    const value = _.values(req.query)[0];
    const account = await Account.findOne({ [key]: value });
    res.send(account);
  } else {
    const accounts = await Account.find();
    res.send(accounts);
  }
});
/**
 * @swagger
 * /api/accounts/{id}:
 *   get:
 *     summary: Get the account by id
 *     tags: [Accounts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The account id
 *     responses:
 *       200:
 *         description: The account description by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Account'
 *       404:
 *         description: The account was not found
 */
router.get("/:id", auth, async (req, res) => {
  const account = await Account.findById({ _id: req.params.id });
  if (!account)
    return res.status(404).send("The account with given ID not found");
  res.send(account);
});

/**
 * @swagger
 * /api/accounts/{email}:
 *   get:
 *     summary: Get the account by email-id
 *     tags: [Accounts]
 *     parameters:
 *       - in: path
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *         description: The email id
 *     responses:
 *       200:
 *         description: The account description by email id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Account'
 *       404:
 *         description: The account was not found
 */
router.get("/email/:email", auth, async (req, res) => {
  const account = await Account.findOne({ email: req.query.email });
  if (!account)
    return res.status(404).send("The account with given email not found");
  res.send(account);
});

/**
 * @swagger
 * /api/accounts/{id}:
 *   delete:
 *     summary: Remove the account by id
 *     tags: [Accounts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The account id
 *
 *     responses:
 *       200:
 *         description: The account was deleted
 *       404:
 *         description: The account was not found
 */
router.delete("/:id", auth, async (req, res) => {
  const account = await Account.deleteOne({ _id: req.params.id });
  if (!account)
    return res.status(404).send("The account with given ID not found");

  res.send(account);
});
/**
 * @swagger
 * /api/accounts/{id}:
 *  put:
 *    summary: Update the account by the id
 *    tags: [Accounts]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The account id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Account'
 *    responses:
 *      200:
 *        description: The account was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Account'
 *      404:
 *        description: The account was not found
 *      500:
 *        description: Some error happened
 */
router.put("/:id", auth, async (req, res) => {
  const { error } = Validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { email } = await User.findById({ _id: req.user._id }).select("email");

  if (!email)
    return res
      .status(400)
      .send("No registered email-id exists for the given Account ID");

  const account = await Account.findOneAndUpdate(
    { _id: req.params.id },
    {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      dateOfBirth: req.body.dateOfBirth,
      gender: req.body.gender,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      postalCode: req.body.postalCode,
      driverLicense: req.body.driverLicense,
      phoneNo: req.body.phoneNo,
      email: email,
    },
    { new: true }
  );

  if (!account)
    return res.status(404).send("The account with given ID not found");
  res.send(account);
});
/**
 * @swagger
 * /api/accounts:
 *     post:
 *      summary: Create a new Account
 *      tags: [Accounts]
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Account'
 *      responses:
 *       200:
 *         description: The account was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Account'
 *      500:
 *         description: Some server error
 */

router.post("/", [auth], async (req, res) => {
  console.log(req.body);
  const { error } = Validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { email } = await User.findById({ _id: req.user._id }).select("email");

  let account = new Account({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    dateOfBirth: req.body.dateOfBirth,
    gender: req.body.gender,
    address: req.body.address,
    city: req.body.city,
    state: req.body.state,
    postalCode: req.body.postalCode,
    driverLicense: req.body.driverLicense,
    phoneNo: req.body.phoneNo,
    email: email,
  });
  account = await account.save();
  res.send(account);
});
module.exports = router;
