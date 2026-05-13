const Job = require("../models/Job");

async function listJobs(req, res, next) {
  try {
    const query = {};
    if (req.query.branch) query.branch = req.query.branch;
    if (req.query.department) query.department = new RegExp(req.query.department, "i");
    if (req.query.search) query.title = new RegExp(req.query.search, "i");
    if (req.query.status) query.status = req.query.status;
    res.json(await Job.find(query).populate("branch").sort("-createdAt"));
  } catch (error) {
    next(error);
  }
}

async function getJob(req, res, next) {
  try {
    const job = await Job.findById(req.params.id).populate("branch");
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (error) {
    next(error);
  }
}

async function createJob(req, res, next) {
  try {
    const job = await Job.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json(await job.populate("branch"));
  } catch (error) {
    next(error);
  }
}

async function updateJob(req, res, next) {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate("branch");
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (error) {
    next(error);
  }
}

async function deleteJob(req, res, next) {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json({ message: "Job deleted" });
  } catch (error) {
    next(error);
  }
}

module.exports = { listJobs, getJob, createJob, updateJob, deleteJob };
