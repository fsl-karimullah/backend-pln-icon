const mongoose = require("mongoose");

const BastModel = mongoose.Schema({
  item: {
    type: mongoose.model.Types.ObjectId,
    ref: "item",
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
module.exports = mongoose.model("bast", BastModel);
