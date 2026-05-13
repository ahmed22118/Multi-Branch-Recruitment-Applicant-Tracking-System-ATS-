const mongoose = require("mongoose");
const dns = require("dns");

async function connectDb() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is required. Use MongoDB Atlas for deployment.");
  }
  if (process.env.MONGO_URI.includes("<user>") || process.env.MONGO_URI.includes("cluster0.xxxxx")) {
    throw new Error("MONGO_URI is still the placeholder value. Put your real MongoDB Atlas connection string in backend/.env.");
  }
  if (process.env.DNS_SERVERS) {
    dns.setServers(process.env.DNS_SERVERS.split(",").map((server) => server.trim()).filter(Boolean));
  }
  mongoose.set("strictQuery", true);
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected");
}

module.exports = { connectDb };
