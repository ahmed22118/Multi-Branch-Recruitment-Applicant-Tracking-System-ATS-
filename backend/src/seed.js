require("dotenv").config();
const mongoose = require("mongoose");
const { connectDb } = require("./utils/db");
const User = require("./models/User");
const Branch = require("./models/Branch");
const Job = require("./models/Job");
const Application = require("./models/Application");
const Interview = require("./models/Interview");

async function seed() {
  await connectDb();
  await Promise.all([User.deleteMany(), Branch.deleteMany(), Job.deleteMany(), Application.deleteMany(), Interview.deleteMany()]);

  const branches = await Branch.insertMany([
    { name: "Islamabad", city: "Islamabad", address: "Blue Area, Islamabad" },
    { name: "Lahore", city: "Lahore", address: "Gulberg III, Lahore" },
    { name: "Karachi", city: "Karachi", address: "Shahrah-e-Faisal, Karachi" },
    { name: "Remote", city: "Remote", address: "Work from anywhere", isRemote: true }
  ]);

  const admin = await User.create({ name: "System Admin", email: "admin@softbranch.com", password: "Admin@12345", role: "admin" });
  await User.create({ name: "HR Manager", email: "hr@softbranch.com", password: "Hr@12345", role: "hr", branch: branches[0]._id });
  const candidate = await User.create({
    name: "Ali Candidate",
    email: "candidate@example.com",
    password: "Candidate@12345",
    role: "candidate",
    skills: ["React", "Node.js", "MongoDB"],
    experience: "1 year internship experience",
    resumeUrl: "https://res.cloudinary.com/demo/raw/upload/sample.pdf"
  });

  const jobs = await Job.insertMany([
    {
      title: "Frontend React Developer",
      department: "Engineering",
      branch: branches[1]._id,
      seats: 3,
      description: "Build responsive recruitment and business applications with React.",
      requirements: ["React", "JavaScript", "REST APIs"],
      createdBy: admin._id
    },
    {
      title: "Node.js Backend Engineer",
      department: "Engineering",
      branch: branches[0]._id,
      seats: 2,
      description: "Develop secure APIs, database models, and integrations.",
      requirements: ["Node.js", "Express", "MongoDB", "JWT"],
      createdBy: admin._id
    },
    {
      title: "UI/UX Intern",
      department: "Design",
      branch: branches[3]._id,
      type: "Internship",
      seats: 4,
      description: "Assist with user flows, wireframes, and dashboard design.",
      requirements: ["Figma", "User Research", "Design Systems"],
      createdBy: admin._id
    }
  ]);

  await Application.create({
    job: jobs[0]._id,
    candidate: candidate._id,
    resumeUrl: candidate.resumeUrl,
    message: "I am excited to apply for this React role.",
    status: "Under Review"
  });

  console.log("Seed data inserted");
  await mongoose.disconnect();
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
