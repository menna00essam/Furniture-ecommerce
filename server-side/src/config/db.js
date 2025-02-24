require("dotenv").config();

const mongoose = require("mongoose");
MONGO_URI =
  "mongodb+srv://mohamedHaleem:furniture236@furniture-ecommerce.j7gb1.mongodb.net/?retryWrites=true&w=majority&appName=furniture-ecommerce";

const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB...", MONGO_URI);
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB Connected Successfully ✅");
  } catch (error) {
    console.error("MongoDB Connection Failed ❌", error);
    process.exit(1);
  }
};

module.exports = connectDB;
