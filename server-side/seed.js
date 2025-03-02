require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./src/config/db");
const User = require("./src/models/user.model");
const Product = require("./src/models/product.model");
const Category = require("./src/models/category.model");
const Cart = require("./src/models/cart.model");
const Blog = require("./src/models/blog.model");
const Order = require("./src/models/order.model");

const seedData = async () => {
  try {
    await connectDB();
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
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedData();
