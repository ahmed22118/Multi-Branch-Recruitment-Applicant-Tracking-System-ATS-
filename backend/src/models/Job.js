const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    department: { type: String, required: true },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },
    type: { type: String, enum: ["Full Time", "Part Time", "Internship", "Contract"], default: "Full Time" },
    seats: { type: Number, required: true, min: 1 },
    description: { type: String, required: true },
    requirements: [String],
    status: { type: String, enum: ["open", "closed"], default: "open" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
