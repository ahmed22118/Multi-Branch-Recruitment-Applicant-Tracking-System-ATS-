const Application = require("../models/Application");
const Job = require("../models/Job");
const { sendEmail } = require("../utils/email");

async function applyForJob(req, res, next) {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job || job.status !== "open") return res.status(404).json({ message: "Open job not found" });

    const resumeUrl = req.file?.path || req.user.resumeUrl;
    if (!resumeUrl) return res.status(400).json({ message: "Resume PDF is required" });

    const application = await Application.create({
      job: job._id,
      candidate: req.user._id,
      resumeUrl,
      coverLetterUrl: req.body.coverLetterUrl || req.user.coverLetterUrl,
      message: req.body.message
    });
    res.status(201).json(await application.populate(["job", "candidate"]));
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: "You already applied for this job" });
    next(error);
  }
}

async function myApplications(req, res, next) {
  try {
    res.json(
      await Application.find({ candidate: req.user._id })
        .populate({ path: "job", populate: "branch" })
        .sort("-createdAt")
    );
  } catch (error) {
    next(error);
  }
}

async function listApplications(req, res, next) {
  try {
    const query = {};
    if (req.query.status) query.status = req.query.status;
    if (req.query.job) query.job = req.query.job;
    res.json(await Application.find(query).populate(["candidate", { path: "job", populate: "branch" }]).sort("-createdAt"));
  } catch (error) {
    next(error);
  }
}

async function updateApplicationStatus(req, res, next) {
  try {
    const application = await Application.findById(req.params.id).populate(["candidate", "job"]);
    if (!application) return res.status(404).json({ message: "Application not found" });
    application.status = req.body.status || application.status;
    await application.save();

    const templates = {
      Shortlisted: "Congratulations, you have been shortlisted.",
      Rejected: "Thank you for applying. We are not moving forward at this time.",
      Selected: "Congratulations, you have been selected."
    };

    if (templates[application.status]) {
      await sendEmail({
        to: application.candidate.email,
        subject: `Application Update: ${application.job.title}`,
        text: `${templates[application.status]}\n\n${req.body.message || ""}`
      });
    }

    res.json(application);
  } catch (error) {
    next(error);
  }
}

async function sendCustomMessage(req, res, next) {
  try {
    const application = await Application.findById(req.params.id).populate(["candidate", "job"]);
    if (!application) return res.status(404).json({ message: "Application not found" });
    await sendEmail({
      to: application.candidate.email,
      subject: req.body.subject || `Message from HR: ${application.job.title}`,
      text: req.body.message
    });
    res.json({ message: "Email sent" });
  } catch (error) {
    next(error);
  }
}

module.exports = { applyForJob, myApplications, listApplications, updateApplicationStatus, sendCustomMessage };
