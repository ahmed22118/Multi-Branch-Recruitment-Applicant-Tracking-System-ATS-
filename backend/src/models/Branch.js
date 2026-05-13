const mongoose = require("mongoose");

const branchSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    city: { type: String, required: true },
    address: String,
    isRemote: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Branch", branchSchema);
