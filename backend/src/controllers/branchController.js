const Branch = require("../models/Branch");

async function listBranches(_req, res, next) {
  try {
    res.json(await Branch.find().sort("name"));
  } catch (error) {
    next(error);
  }
}

async function createBranch(req, res, next) {
  try {
    res.status(201).json(await Branch.create(req.body));
  } catch (error) {
    next(error);
  }
}

async function updateBranch(req, res, next) {
  try {
    const branch = await Branch.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!branch) return res.status(404).json({ message: "Branch not found" });
    res.json(branch);
  } catch (error) {
    next(error);
  }
}

async function deleteBranch(req, res, next) {
  try {
    const branch = await Branch.findByIdAndDelete(req.params.id);
    if (!branch) return res.status(404).json({ message: "Branch not found" });
    res.json({ message: "Branch deleted" });
  } catch (error) {
    next(error);
  }
}

module.exports = { listBranches, createBranch, updateBranch, deleteBranch };
