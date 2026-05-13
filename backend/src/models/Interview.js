const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
  {
    application: { type: mongoose.Schema.Types.ObjectId, ref: "Application", required: true },
    scheduledBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    dateTime: { type: Date, required: true },
    location: { type: String, default: "Google Meet" },
    message: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Interview", interviewSchema);
