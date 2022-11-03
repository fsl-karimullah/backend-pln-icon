const express = require("express");
const router = express.Router();
const auth = require("../../../middleware/auth");
const { check, validationResult } = require("express-validator");
const ItemType = require("../../../models/ItemType");

//get all items
router.get("/", auth, async (req, res) => {
  try {
    const items = await ItemType.find({ user: req.user.id }).sort({ date: -1 });
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

//post an item
router.post(
  "/",
  auth,
  check("itemName", "Item name is required").notEmpty(),
  check("itemType", "Item type is required").notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { itemName, itemType } = req.body;

    try {
      const newItems = new ItemType({
        itemName,
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
  const { itemName, itemType } = req.body;
  const itemField = {};

  if (itemName) itemField.itemName = itemName;
  if (itemType) itemField.itemType = itemType;
  try {
    let items = await ItemType.findById(req.params.id);
    if (!items) return res.status(404).json({ msg: "Items not found" });

    //make sure user own items
    if (items.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    items = await ItemType.findByIdAndUpdate(
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

//delete item
router.delete("/:id", auth, async (req, res) => {
  try {
    const items = await ItemType.findById(req.params.id);
    if (!items) {
      return res.status(401).json({ msg: "User not authorize" });
    }
    await ItemType.findByIdAndRemove(req.params.id);
    res.json({ msg: "Item deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

module.exports = router;
