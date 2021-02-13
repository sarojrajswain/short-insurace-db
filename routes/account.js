const auth = require("../middleware/auth");
const { Account, Validate } = require("../models/account");
const express = require("express");
const router = express.Router();

router.get("/", auth, async (req, res) => {
  const accounts = await Account.find();
  res.send(accounts);
});

router.get("/:id", auth, async (req, res) => {
  const account = await Account.findById({ _id: req.params.id });
  if (!account)
    return res.status(404).send("The account with given ID not found");
  res.send(account);
});

router.delete("/:id", async (req, res) => {
  const account = await Account.deleteOne({ _id: req.params.id });
  if (!account)
    return res.status(404).send("The account with given ID not found");

  res.send(account);
});

router.put("/:id", async (req, res) => {
  const { error } = Validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const account = await Account.findOneAndUpdate(
    { _id: req.params.id },
    {
      name: req.body.name,
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

router.post("/", async (req, res) => {
  const { error } = Validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let account = new Account({
    name: req.body.name,
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
