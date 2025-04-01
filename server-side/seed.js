require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./src/config/db");
const User = require("./src/models/user.model");
const Product = require("./src/models/product.model");
const Category = require("./src/models/category.model");
const Cart = require("./src/models/cart.model");
const Blog = require("./src/models/blog.model");
const Order = require("./src/models/order.model");
// const Image = require("./src/models/image.model");

const seedData = async () => {
  try {
    await connectDB();
    console.log("Seeding Database...");

    // Clear existing data

    // await User.deleteMany();
    // await Product.deleteMany();
    // await Category.deleteMany();
    // await Cart.deleteMany();
    // await Blog.deleteMany();
    // await Order.deleteMany();
    // await Image.deleteMany();

    // ======================
    // 1. Create Users
    // ======================
    // const users = await User.insertMany([
    //   {
    //     username: "Haleem",
    //     email: "Haleemo777@example.com",
    //     password: "haleemo236!",
    //     role: "ADMIN",
    //     phone: "01126105400",
    //   },
    //   {
    //     username: "Mohamed",
    //     email: "Mohamed236236@gmail.com",
    //     password: "hiiiii263!",
    //     phone: "01126105400",
    //   },
    // ]);

    // ======================
    // 2. Create Categories
    // ======================
    // const categories = await Category.insertMany([
    //   // {
    //   //   catName: "Sofa",
    //   //   description:
    //   //     "comfortable seating furniture piece designed for living rooms, offering both style and relaxation.",
    //   //   image:
    //   //     "https://res.cloudinary.com/dddhappm3/image/upload/v1743163620/Sofas_wrzbpe.webp",
    //   // },
    // ]);

    // ======================
    // 3. Create Products
    // ======================

    const products = await Product.insertMany([
      {
        productName: "ektorp",
        productSubtitle: "toom modular sofa",
        productPrice: 900.99,
        productSale: 66,
        productCategories: ["65f1c3a7a9f88a001b23d456"],
        productDescription:
          "A comfortable and stylish modern sofa with premium fabric upholstery.",
        brand: "HomeStyle",
        colors: [
          {
            name: "Graphite Black",
            hex: "#1C1C1C",

            images: [
              {
                public_id:
                  "categories/sofas/toom modular sofa/graphite-black/toom_modular_sofa-3_kqvegm",
                url: "https://res.cloudinary.com/dddhappm3/image/upload/v1742561371/categories/sofas/toom%20modular%20sofa/graphite-black/toom_modular_sofa-3_kqvegm.webp",
              },
              {
                public_id:
                  "categories/sofas/toom modular sofa/graphite-black/toom_modular_sofa-6_bwqlfu",
                url: "https://res.cloudinary.com/dddhappm3/image/upload/v1742561371/categories/sofas/toom%20modular%20sofa/graphite-black/toom_modular_sofa-6_bwqlfu.webp",
              },
              {
                public_id:
                  "categories/sofas/toom modular sofa/graphite-black/toom_modular_sofa-5_pvoee0",
                url: "https://res.cloudinary.com/dddhappm3/image/upload/v1742561370/categories/sofas/toom%20modular%20sofa/graphite-black/toom_modular_sofa-5_pvoee0.webp",
              },
              {
                public_id:
                  "categories/sofas/toom modular sofa/graphite-black/toom_modular_sofa-4_snvdcc",
                url: "https://res.cloudinary.com/dddhappm3/image/upload/v1742561370/categories/sofas/toom%20modular%20sofa/graphite-black/toom_modular_sofa-4_snvdcc.webp",
              },
              {
                public_id:
                  "categories/sofas/toom modular sofa/graphite-black/toom_modular_sofa-2_qgchdf",
                url: "https://res.cloudinary.com/dddhappm3/image/upload/v1742561369/categories/sofas/toom%20modular%20sofa/graphite-black/toom_modular_sofa-2_qgchdf.webp",
              },
              {
                public_id:
                  "categories/sofas/toom modular sofa/graphite-black/toom_modular_sofa-1_iawzkd",
                url: "https://res.cloudinary.com/dddhappm3/image/upload/v1742561367/categories/sofas/toom%20modular%20sofa/graphite-black/toom_modular_sofa-1_iawzkd.webp",
              },
            ],
            quantity: 12,
          },
        ],

        additionalInformation: {
          general: {
            salesPackage: "1 Sofa",
            modelNumber: "SOFA-123",
            configuration: "Fixed Seat",
            upholsteryMaterial: "Velvet",
            upholsteryColor: "Black",
          },
          productDetails: {
            fillingMaterial: "Foam",
            finishType: "Matte",
            adjustableHeadrest: false,
            maximumLoadCapacity: 300,
            originOfManufacture: "USA",
          },
          dimensions: {
            width: 200,
            height: 85,
            depth: 90,
            seatHeight: 45,
            legHeight: 10,
          },
          warranty: {
            summary: "1 Year Warranty",
            serviceType: "Onsite Service",
            covered: "Manufacturing Defects",
            notCovered: "Physical Damage",
            domesticWarranty: "Yes",
          },
        },
      },
    ]);

    // ======================
    // 5. Create Carts
    // ======================
    // const carts = await Cart.insertMany([
    //   {
    //     userId: users[1]._id,
    //     products: [
    //       {
    //         productId: products[0]._id,
    //         quantity: 2,
    //       },
    //       {
    //         productId: products[1]._id,
    //         quantity: 1,
    //       },
    //     ],
    //   },
    //   {
    //     userId: users[0]._id,
    //     products: [
    //       {
    //         productId: products[0]._id,
    //         quantity: 2,
    //       },
    //       {
    //         productId: products[1]._id,
    //         quantity: 4,
    //       },
    //     ],
    //   },
    // ]);
    // // ======================
    // // 6. Create Orders
    // // ======================
    // const orders = await Order.insertMany([
    //   {
    //     userId: users[1]._id,
    //     orderItems: [
    //       {
    //         productId: products[0]._id,
    //         quantity: 1,
    //       },
    //     ],
    //     shippingAddress: {
    //       street: "123 Main Street",
    //       city: "New York",
    //       province: "NY",
    //       zipCode: "10001",
    //       country: "USA",
    //     },
    //     totalAmount: products[0].productPrice * 0.9, // 10% discount
    //     paymentMethod: "Direct Bank Transfer",
    //     status: "Delivered",
    //     transactionId: "TX123456789",
    //   },
    // ]);

    // ======================
    // 7. Create Images
    // ======================
    // const images = await Image.insertMany([
    //   {
    //     public_id: "living_room_1",
    //     url: "https://example.com/living-room.jpg",
    //   },
    //   {
    //     public_id: "bedroom_1",
    //     url: "https://example.com/bedroom.jpg",
    //   },
    // ]);

    console.log("Database Seeding Completed ✅");
    console.log(`Summary:
      Products: ${products.length}`);

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
