require("dotenv").config(); // Load env variables
const mongoose = require("mongoose"); // Import mongoose
const connectDB = require("../../config/db");
const User = require("../user.model");
const Product = require("../product.model");
const Category = require("../category.model");
const Cart = require("../cart.model");
const Blog = require("../blog.model");
const Order = require("../order.model");

const seedData = async () => {
  try {
    await connectDB();
    console.log("URIIIIIIII", process.env.MONGO_URI);
    console.log("PORT", process.env.PORT);
    console.log("Seeding Database...");

    await User.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await Cart.deleteMany();
    await Blog.deleteMany();
    await Order.deleteMany();

    // Insert Sample Data
    const categories = await Category.insertMany([
      { catName: "Living Room", description: "Furniture for the living room" },
      { catName: "Bedroom", description: "Furniture for the bedroom" },
    ]);

    console.log("Database Seeding Completed ✅");

    // Properly close the connection
    await mongoose.connection.close();
    console.log("MongoDB Connection Closed 🔌");
    process.exit(0);
  } catch (error) {
    console.error("Seeding Failed ❌", error);
    await mongoose.connection.close(); // Ensure cleanup
    process.exit(1);
  }
};

// Run the seeding function
seedData();
