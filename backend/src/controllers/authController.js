const jwt = require("jsonwebtoken");
const User = require("../models/User");

function tokenFor(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

function publicUser(user) {
  const obj = user.toObject();
  delete obj.password;
  return obj;
}

async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password || password.length < 8) {
      return res.status(400).json({ message: "Name, valid email, and 8 character password are required" });
    }
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: "Email already registered" });
    const user = await User.create({ name, email, password, role: "candidate" });
    res.status(201).json({ token: tokenFor(user), user: publicUser(user) });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    res.json({ token: tokenFor(user), user: publicUser(user) });
  } catch (error) {
    next(error);
  }
}

async function me(req, res) {
  res.json(req.user);
}

async function updateProfile(req, res, next) {
  try {
    const fields = ["name", "phone", "skills", "experience", "education"];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) req.user[field] = req.body[field];
    });
    if (typeof req.body.skills === "string") {
      req.user.skills = req.body.skills.split(",").map((skill) => skill.trim()).filter(Boolean);
    }
    if (req.files?.profileImage?.[0]) req.user.profileImageUrl = req.files.profileImage[0].path;
    if (req.files?.resume?.[0]) req.user.resumeUrl = req.files.resume[0].path;
    if (req.files?.coverLetter?.[0]) req.user.coverLetterUrl = req.files.coverLetter[0].path;
    await req.user.save();
    res.json(publicUser(req.user));
  } catch (error) {
    next(error);
  }
}

module.exports = { register, login, me, updateProfile };
