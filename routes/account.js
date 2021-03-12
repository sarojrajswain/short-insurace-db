const admin = require("../middleware/admin");
const auth = require("../middleware/auth");
const { Account, Validate } = require("../models/account");
const { User } = require("../models/users");
const express = require("express");
const router = express.Router();

/**
 * @swagger
 * components:
 *    schemas:
 *     Account:
 *       type: object
 *       required:
 *          - name
 *          - address
 *          - city
 *          - state
 *          - postalCode
 *          - gender
 *          - phone
 *          - dlNumber
 *          - identificationNo
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the Account
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
 *         gender:
 *           type: string
 *           description: Gender
 *         phone:
 *           type: number
 *           description: Mobile Number
 *         dlNumber:
 *           type: string
 *           description: Driver license number
 *         identificationNo:
 *           type: string
 *           description: Identification/Aadhar card number
 *       example:
 *         name: Saroj Raj Swain
 *         address: 2521 Forest Haven BLVD
 *         city: Bhubaneswar
 *         state: Odisha
 *         postalCode: 02839
 *         gender: M
 *         phone: 1234567890
 *         dlNumber: DL-001-OD
 *         identificationNo: AA0024233
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

router.get("/", auth, async (req, res) => {
  const accounts = await Account.find();
  res.send(accounts);
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
      name: req.body.name,
      email: email,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      postalCode: req.body.postalCode,
      gender: req.body.gender,
      phone: req.body.phone,
      dlNumber: req.body.dlNumber,
      identificationNo: req.body.identificationNo,
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
  const { error } = Validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { email } = await User.findById({ _id: req.user._id }).select("email");

  let account = new Account({
    name: req.body.name,
    email: email,
    address: req.body.address,
    city: req.body.city,
    state: req.body.state,
    postalCode: req.body.postalCode,
    gender: req.body.gender,
    phone: req.body.phone,
    dlNumber: req.body.dlNumber,
    identificationNo: req.body.identificationNo,
  });
  account = await account.save();
  res.send(account);
});
module.exports = router;
