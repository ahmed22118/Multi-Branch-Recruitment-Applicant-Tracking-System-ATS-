const express = require("express");
const {
  applyForJob,
  myApplications,
  listApplications,
  updateApplicationStatus,
  sendCustomMessage
} = require("../controllers/applicationController");
const { protect, authorize } = require("../middleware/authMiddleware");
const { upload } = require("../utils/cloudinary");

const router = express.Router();

router.post("/jobs/:jobId", protect, authorize("candidate"), upload.single("resume"), applyForJob);
router.get("/mine", protect, authorize("candidate"), myApplications);
router.get("/", protect, authorize("hr", "admin"), listApplications);
router.patch("/:id/status", protect, authorize("hr", "admin"), updateApplicationStatus);
router.post("/:id/message", protect, authorize("hr", "admin"), sendCustomMessage);

module.exports = router;
