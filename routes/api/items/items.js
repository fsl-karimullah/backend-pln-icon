const express = require("express");
const router = express.Router();
const auth = require("../../../middleware/auth");
const { check, validationResult } = require("express-validator");
const Items = require("../../../models/Items");

//get all items
router.get("/", auth, async (req, res) => {
  try {
    const items = await Items.find({ user: req.user.id }).sort({ date: -1 });
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

//create items
router.post(
  "/",
  auth,
  check("itemName", "Item name is required").notEmpty(),
  check("itemSerialNumber", "Scan the serial number").notEmpty(),
  check("itemType", "Please select item type").notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { itemName, itemSerialNumber, itemType } = req.body;
    try {
      const newItems = new Items({
        itemName,
        itemSerialNumber,
        itemType,
        user: req.user.id,
      });
      const items = await newItems.save();
      res.json(items);
    } catch (error) {
      console.error(error);
      res.status(500).send("Server Error");
    }
  }
);

//update items

router.put("/:id", auth, async (req, res) => {
  const { itemName, itemSerialNumber, itemType } = req.body;
  const itemField = {};

  if (itemName) itemField.itemName = itemName;
  if (itemSerialNumber) itemField.itemSerialNumber = itemSerialNumber;
  if (itemType) itemField.itemField = itemType;

  try {
    let items = await Items.findById(req.params.id);
    if (!items) return res.status(404).json({ msg: "Items not found" });

    //make sure user own items
    if (items.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    items = await Items.findByIdAndUpdate(
      req.params.id,
      { $set: itemField },
      { new: true }
    );
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

//delete items
router.delete("/:id", auth, async (req, res) => {
  try {
    const items = await Items.findById(req.params.id);
    if (!items) {
      return res.status(401).json({ msg: "User not authorize" });
    }
    await Items.findByIdAndRemove(req.params.id);
    res.json({ msg: "Items deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

module.exports = router;
