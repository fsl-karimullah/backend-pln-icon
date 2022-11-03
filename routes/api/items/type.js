const express = require("express");
const router = express.Router();
const auth = require("../../../middleware/auth");
const { check, validationResult } = require("express-validator");
const TypeItemsModel = require("../../../models/ItemType");

//get all type items
router.get("/", auth, async (req, res) => {
  try {
    const itemType = await TypeItemsModel.find({ user: req.user.id }).sort({
      date: -1,
    });
    res.json(itemType);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

//post an item type
router.post(
  "/",
  auth,
  check("itemName", "Item name name is required").notEmpty(),
  check("itemType", "Type of item is required").notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { itemName, itemType } = req.body;
    try {
      const newItem = new TypeItemsModel({
        itemName,
        itemType,
        user: req.user.id,
      });
      const typeItems = await newItem.save();
      res.json(typeItems);
    } catch (error) {
      console.error(error);
      res.status(500).send("Server Error");
    }
  }
);

//update an items
router.put("/:id", auth, async (req, res) => {
  const { itemName, itemType } = req.body;
  const itemTypeField = {};

  if (itemName) itemTypeField.itemName = itemName;
  if (itemType) itemTypeField.itemType = itemType;
  try {
    let typeItems = await TypeItemsModel.findById(req.params.id);
    if (!typeItems) return res.status(404).json({ msg: "Item Type not found" });

    //make sure user own items
    if (typeItems.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    typeItems = await TypeItemsModel.findByIdAndUpdate(
      req.params.id,
      { $set: itemTypeField },
      { new: true }
    );
    res.json(typeItems);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});
//delete items type
router.delete("/:id", auth, async (req, res) => {
  try {
    const typeItems = await TypeItemsModel.findById(req.params.id);
    if (!typeItems) {
      return res.status(401).json({ msg: "User not authorize" });
    }
    await TypeItemsModel.findByIdAndRemove(req.params.id);
    res.json({ msg: "Item Type deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});
module.exports = router;
