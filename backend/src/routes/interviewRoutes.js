const express = require("express");
const { scheduleInterview, listInterviews } = require("../controllers/interviewController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, authorize("hr", "admin"), listInterviews);
router.post("/", protect, authorize("hr", "admin"), scheduleInterview);

module.exports = router;
