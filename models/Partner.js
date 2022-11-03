const mongoose = require("mongoose");

const PartnerModel = mongoose.Schema({
  partnerName: {
    type: String,
    required: true,
  },
  partnerAdress: {
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
module.exports = mongoose.model("partner", PartnerModel);
