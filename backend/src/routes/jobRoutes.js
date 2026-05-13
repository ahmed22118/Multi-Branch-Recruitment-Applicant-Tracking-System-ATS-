const express = require("express");
const { listJobs, getJob, createJob, updateJob, deleteJob } = require("../controllers/jobController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", listJobs);
router.get("/:id", getJob);
router.post("/", protect, authorize("hr", "admin"), createJob);
router.put("/:id", protect, authorize("hr", "admin"), updateJob);
router.delete("/:id", protect, authorize("admin"), deleteJob);

module.exports = router;
