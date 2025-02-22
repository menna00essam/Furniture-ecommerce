const mongoose = require("mongoose");
// process.env.MONGO_URI
const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/furnatiaro", {});
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ Database Connection Failed");
  }
};
module.exports = connectDB;
