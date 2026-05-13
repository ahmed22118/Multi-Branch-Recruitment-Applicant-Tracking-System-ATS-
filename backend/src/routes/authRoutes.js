const express = require("express");
const { register, login, me, updateProfile } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const { upload } = require("../utils/cloudinary");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, me);
router.put(
  "/profile",
  protect,
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "resume", maxCount: 1 },
    { name: "coverLetter", maxCount: 1 }
  ]),
  updateProfile
);

module.exports = router;
