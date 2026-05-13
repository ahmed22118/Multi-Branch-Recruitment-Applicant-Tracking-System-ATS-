const Interview = require("../models/Interview");
const Application = require("../models/Application");
const { sendEmail } = require("../utils/email");

async function scheduleInterview(req, res, next) {
  try {
    const application = await Application.findById(req.body.application).populate(["candidate", "job"]);
    if (!application) return res.status(404).json({ message: "Application not found" });

    const interview = await Interview.create({
      application: application._id,
      scheduledBy: req.user._id,
      dateTime: req.body.dateTime,
      location: req.body.location,
      message: req.body.message
    });

    application.status = "Interview Scheduled";
    await application.save();

    await sendEmail({
      to: application.candidate.email,
      subject: `Interview Invitation: ${application.job.title}`,
      text: `Your interview is scheduled for ${new Date(req.body.dateTime).toLocaleString()}.\nLocation: ${req.body.location || "Google Meet"}\n\n${req.body.message || ""}`
    });

    res.status(201).json(await interview.populate({ path: "application", populate: ["candidate", "job"] }));
  } catch (error) {
    next(error);
  }
}

async function listInterviews(_req, res, next) {
  try {
    res.json(await Interview.find().populate({ path: "application", populate: ["candidate", "job"] }).sort("dateTime"));
  } catch (error) {
    next(error);
  }
}

module.exports = { scheduleInterview, listInterviews };
