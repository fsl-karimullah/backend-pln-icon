const mongoose = require("mongoose");

const ItemModel = mongoose.Schema({
  itemName: {
    type: String,
    required: true,
  },
  itemSerialNumber: {
    type: String,
    required: true,
    unique: true,
  },
  itemType: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
});
module.exports = mongoose.model("item", ItemModel);
