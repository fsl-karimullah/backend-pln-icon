const mongoose = require("mongoose");

const itemTypeModel = mongoose.Schema({
  itemName: {
    type: String,
    required: true,
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
module.exports = mongoose.model("itemType", itemTypeModel);
