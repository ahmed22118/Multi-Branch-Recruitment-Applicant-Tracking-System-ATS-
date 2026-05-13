const express = require("express");
const { listBranches, createBranch, updateBranch, deleteBranch } = require("../controllers/branchController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", listBranches);
router.post("/", protect, authorize("hr", "admin"), createBranch);
router.put("/:id", protect, authorize("hr", "admin"), updateBranch);
router.delete("/:id", protect, authorize("admin"), deleteBranch);

module.exports = router;
