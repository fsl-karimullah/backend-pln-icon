const express = require("express");
const router = express.Router();
const auth = require("../../../middleware/auth");
const { check, validationResult } = require("express-validator");
const PartnerModel = require("../../../models/Partner");

//get all Partner
router.get("/", auth, async (req, res) => {
  try {
    const partner = await PartnerModel.find({ user: req.user.id }).sort({
      date: -1,
    });
    res.json(partner);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

//post an Partner
router.post(
  "/",
  auth,
  check("partnerName", "Partner name is required").notEmpty(),
  check("partnerAdress", "Partner adress is required").notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { partnerName, partnerAdress } = req.body;
    try {
      const newPartner = new PartnerModel({
        partnerName,
        partnerAdress,
        user: req.user.id,
      });
      const partner = await newPartner.save();
      res.json(partner);
    } catch (error) {
      console.error(error);
      res.status(500).send("Server Error");
    }
  }
);
//update partner
router.put("/:id", auth, async (req, res) => {
  const { partnerName, partnerAdress } = req.body;
  const partnerField = {};

  if (partnerName) partnerField.partnerName = partnerName;
  if (partnerAdress) partnerField.partnerAdress = partnerAdress;
  try {
    let partner = await PartnerModel.findById(req.params.id);
    if (!partner) return res.status(404).json({ msg: "Partner not found" });

    //make sure user own items
    if (partner.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    partner = await PartnerModel.findByIdAndUpdate(
      req.params.id,
      { $set: partnerField },
      { new: true }
    );
    res.json(partner);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});
//delete partner
router.delete("/:id", auth, async (req, res) => {
  try {
    const partner = await PartnerModel.findById(req.params.id);
    if (!partner) {
      return res.status(401).json({ msg: "User not authorize" });
    }
    await PartnerModel.findByIdAndRemove(req.params.id);
    res.json({ msg: "Partner deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});
module.exports = router;
