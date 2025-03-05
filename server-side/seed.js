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

    await Product.deleteMany();
    await Category.deleteMany();
    await Cart.deleteMany();
    await Blog.deleteMany();
    await Order.deleteMany();

    // Insert Sample Categories
    const categories = await Category.insertMany([
      { catName: "Living Room", description: "Furniture for the living room" },
      { catName: "Bedroom", description: "Furniture for the bedroom" },
      { catName: "Dining Room", description: "Furniture for the dining room" },
    ]);

    // Insert Sample Products with full model data
    const products = await Product.insertMany([
      {
        productName: "Modern Sofa Set",
        productSubtitle: "Luxury Leather Sofa Set",
        productImages: ["sofa1.jpg", "sofa2.jpg"],
        productPrice: 1200,
        productQuantity: 10,
        productSale: 10,
        productCategories: [categories[0]._id],
        productDescription:
          "A modern and luxurious leather sofa set for your living room.",
        colors: ["Black", "Brown"],
        sizes: ["Large", "Medium"],
        brand: "LuxuryHome",
        additionalInformation: {
          general: {
            salesPackage: "1 Sofa, 2 Cushions",
            modelNumber: "SF2023",
            secondaryMaterial: "Wood",
            configuration: "L-Shape",
            upholsteryMaterial: "Genuine Leather",
            upholsteryColor: "Black",
          },
          productDetails: {
            fillingMaterial: "Foam",
            finishType: "Matte",
            adjustableHeadrest: true,
            maximumLoadCapacity: 300,
            originOfManufacture: "USA",
          },
          dimensions: {
            width: 220,
            height: 90,
            depth: 100,
            seatHeight: 45,
            legHeight: 10,
          },
          materials: {
            primaryMaterial: "Leather",
            upholsteryMaterial: "Genuine Leather",
            upholsteryColor: "Black",
            fillingMaterial: "Foam",
            finishType: "Matte",
          },
          specifications: {
            adjustableHeadrest: true,
            maximumLoadCapacity: 300,
            originOfManufacture: "USA",
            weight: 50,
            brand: "LuxuryHome",
          },
          warranty: {
            summary: "5 Years Manufacturer Warranty",
            serviceType: "On-site Service",
            covered: "Manufacturing Defects",
            notCovered: "Physical Damage",
            domesticWarranty: "5 Years",
          },
        },
      },
      {
        productName: "Wooden King Bed",
        productSubtitle: "Solid Wood King Size Bed with Storage",
        productImages: ["bed1.jpg", "bed2.jpg"],
        productPrice: 1500,
        productQuantity: 5,
        productSale: 5,
        productCategories: [categories[1]._id],
        productDescription:
          "A sturdy and elegant wooden king-size bed with storage drawers.",
        colors: ["Mahogany", "Walnut"],
        sizes: ["King"],
        brand: "WoodCraft",
        additionalInformation: {
          general: {
            salesPackage: "1 Bed Frame, Storage Drawers",
            modelNumber: "WD2023",
            secondaryMaterial: "Plywood",
            configuration: "Storage Bed",
            upholsteryMaterial: "None",
            upholsteryColor: "N/A",
          },
          productDetails: {
            fillingMaterial: "N/A",
            finishType: "Glossy",
            adjustableHeadrest: false,
            maximumLoadCapacity: 500,
            originOfManufacture: "India",
          },
          dimensions: {
            width: 200,
            height: 120,
            depth: 220,
            seatHeight: 50,
            legHeight: 15,
          },
          materials: {
            primaryMaterial: "Solid Wood",
            upholsteryMaterial: "None",
            upholsteryColor: "N/A",
            fillingMaterial: "N/A",
            finishType: "Glossy",
          },
          specifications: {
            adjustableHeadrest: false,
            maximumLoadCapacity: 500,
            originOfManufacture: "India",
            weight: 80,
            brand: "WoodCraft",
          },
          warranty: {
            summary: "3 Years Manufacturer Warranty",
            serviceType: "Doorstep Repair",
            covered: "Manufacturing Defects",
            notCovered: "Wear and Tear",
            domesticWarranty: "3 Years",
          },
        },
      },
      {
        productName: "Modern Sofa Set",
        productSubtitle: "Luxury Leather Sofa Set",
        productImages: ["sofa1.jpg", "sofa2.jpg"],
        productPrice: 1200,
        productQuantity: 10,
        productSale: 10,
        productCategories: [categories[0]._id],
        productDescription:
          "A modern and luxurious leather sofa set for your living room.",
        colors: ["Black", "Brown"],
        sizes: ["Large", "Medium"],
        brand: "LuxuryHome",
        additionalInformation: {
          general: {
            salesPackage: "1 Sofa, 2 Cushions",
            modelNumber: "SF2023",
            secondaryMaterial: "Wood",
            configuration: "L-Shape",
            upholsteryMaterial: "Genuine Leather",
            upholsteryColor: "Black",
          },
          productDetails: {
            fillingMaterial: "Foam",
            finishType: "Matte",
            adjustableHeadrest: true,
            maximumLoadCapacity: 300,
            originOfManufacture: "USA",
          },
          dimensions: {
            width: 220,
            height: 90,
            depth: 100,
            seatHeight: 45,
            legHeight: 10,
          },
          materials: {
            primaryMaterial: "Leather",
            upholsteryMaterial: "Genuine Leather",
            upholsteryColor: "Black",
            fillingMaterial: "Foam",
            finishType: "Matte",
          },
          specifications: {
            adjustableHeadrest: true,
            maximumLoadCapacity: 300,
            originOfManufacture: "USA",
            weight: 50,
            brand: "LuxuryHome",
          },
          warranty: {
            summary: "5 Years Manufacturer Warranty",
            serviceType: "On-site Service",
            covered: "Manufacturing Defects",
            notCovered: "Physical Damage",
            domesticWarranty: "5 Years",
          },
        },
      },
      {
        productName: "Wooden King Bed",
        productSubtitle: "Solid Wood King Size Bed with Storage",
        productImages: ["bed1.jpg", "bed2.jpg"],
        productPrice: 1500,
        productQuantity: 5,
        productSale: 5,
        productCategories: [categories[1]._id],
        productDescription:
          "A sturdy and elegant wooden king-size bed with storage drawers.",
        colors: ["Mahogany", "Walnut"],
        sizes: ["King"],
        brand: "WoodCraft",
        additionalInformation: {
          general: {
            salesPackage: "1 Bed Frame, Storage Drawers",
            modelNumber: "WD2023",
            secondaryMaterial: "Plywood",
            configuration: "Storage Bed",
            upholsteryMaterial: "None",
            upholsteryColor: "N/A",
          },
          productDetails: {
            fillingMaterial: "N/A",
            finishType: "Glossy",
            adjustableHeadrest: false,
            maximumLoadCapacity: 500,
            originOfManufacture: "India",
          },
          dimensions: {
            width: 200,
            height: 120,
            depth: 220,
            seatHeight: 50,
            legHeight: 15,
          },
          materials: {
            primaryMaterial: "Solid Wood",
            upholsteryMaterial: "None",
            upholsteryColor: "N/A",
            fillingMaterial: "N/A",
            finishType: "Glossy",
          },
          specifications: {
            adjustableHeadrest: false,
            maximumLoadCapacity: 500,
            originOfManufacture: "India",
            weight: 80,
            brand: "WoodCraft",
          },
          warranty: {
            summary: "3 Years Manufacturer Warranty",
            serviceType: "Doorstep Repair",
            covered: "Manufacturing Defects",
            notCovered: "Wear and Tear",
            domesticWarranty: "3 Years",
          },
        },
      },
      {
        productName: "Modern Sofa Set",
        productSubtitle: "Luxury Leather Sofa Set",
        productImages: ["sofa1.jpg", "sofa2.jpg"],
        productPrice: 1200,
        productQuantity: 10,
        productSale: 10,
        productCategories: [categories[0]._id],
        productDescription:
          "A modern and luxurious leather sofa set for your living room.",
        colors: ["Black", "Brown"],
        sizes: ["Large", "Medium"],
        brand: "LuxuryHome",
        additionalInformation: {
          general: {
            salesPackage: "1 Sofa, 2 Cushions",
            modelNumber: "SF2023",
            secondaryMaterial: "Wood",
            configuration: "L-Shape",
            upholsteryMaterial: "Genuine Leather",
            upholsteryColor: "Black",
          },
          productDetails: {
            fillingMaterial: "Foam",
            finishType: "Matte",
            adjustableHeadrest: true,
            maximumLoadCapacity: 300,
            originOfManufacture: "USA",
          },
          dimensions: {
            width: 220,
            height: 90,
            depth: 100,
            seatHeight: 45,
            legHeight: 10,
          },
          materials: {
            primaryMaterial: "Leather",
            upholsteryMaterial: "Genuine Leather",
            upholsteryColor: "Black",
            fillingMaterial: "Foam",
            finishType: "Matte",
          },
          specifications: {
            adjustableHeadrest: true,
            maximumLoadCapacity: 300,
            originOfManufacture: "USA",
            weight: 50,
            brand: "LuxuryHome",
          },
          warranty: {
            summary: "5 Years Manufacturer Warranty",
            serviceType: "On-site Service",
            covered: "Manufacturing Defects",
            notCovered: "Physical Damage",
            domesticWarranty: "5 Years",
          },
        },
      },
      {
        productName: "Wooden King Bed",
        productSubtitle: "Solid Wood King Size Bed with Storage",
        productImages: ["bed1.jpg", "bed2.jpg"],
        productPrice: 1500,
        productQuantity: 5,
        productSale: 5,
        productCategories: [categories[1]._id],
        productDescription:
          "A sturdy and elegant wooden king-size bed with storage drawers.",
        colors: ["Mahogany", "Walnut"],
        sizes: ["King"],
        brand: "WoodCraft",
        additionalInformation: {
          general: {
            salesPackage: "1 Bed Frame, Storage Drawers",
            modelNumber: "WD2023",
            secondaryMaterial: "Plywood",
            configuration: "Storage Bed",
            upholsteryMaterial: "None",
            upholsteryColor: "N/A",
          },
          productDetails: {
            fillingMaterial: "N/A",
            finishType: "Glossy",
            adjustableHeadrest: false,
            maximumLoadCapacity: 500,
            originOfManufacture: "India",
          },
          dimensions: {
            width: 200,
            height: 120,
            depth: 220,
            seatHeight: 50,
            legHeight: 15,
          },
          materials: {
            primaryMaterial: "Solid Wood",
            upholsteryMaterial: "None",
            upholsteryColor: "N/A",
            fillingMaterial: "N/A",
            finishType: "Glossy",
          },
          specifications: {
            adjustableHeadrest: false,
            maximumLoadCapacity: 500,
            originOfManufacture: "India",
            weight: 80,
            brand: "WoodCraft",
          },
          warranty: {
            summary: "3 Years Manufacturer Warranty",
            serviceType: "Doorstep Repair",
            covered: "Manufacturing Defects",
            notCovered: "Wear and Tear",
            domesticWarranty: "3 Years",
          },
        },
      },
      {
        productName: "Modern Sofa Set",
        productSubtitle: "Luxury Leather Sofa Set",
        productImages: ["sofa1.jpg", "sofa2.jpg"],
        productPrice: 1200,
        productQuantity: 10,
        productSale: 10,
        productCategories: [categories[0]._id],
        productDescription:
          "A modern and luxurious leather sofa set for your living room.",
        colors: ["Black", "Brown"],
        sizes: ["Large", "Medium"],
        brand: "LuxuryHome",
        additionalInformation: {
          general: {
            salesPackage: "1 Sofa, 2 Cushions",
            modelNumber: "SF2023",
            secondaryMaterial: "Wood",
            configuration: "L-Shape",
            upholsteryMaterial: "Genuine Leather",
            upholsteryColor: "Black",
          },
          productDetails: {
            fillingMaterial: "Foam",
            finishType: "Matte",
            adjustableHeadrest: true,
            maximumLoadCapacity: 300,
            originOfManufacture: "USA",
          },
          dimensions: {
            width: 220,
            height: 90,
            depth: 100,
            seatHeight: 45,
            legHeight: 10,
          },
          materials: {
            primaryMaterial: "Leather",
            upholsteryMaterial: "Genuine Leather",
            upholsteryColor: "Black",
            fillingMaterial: "Foam",
            finishType: "Matte",
          },
          specifications: {
            adjustableHeadrest: true,
            maximumLoadCapacity: 300,
            originOfManufacture: "USA",
            weight: 50,
            brand: "LuxuryHome",
          },
          warranty: {
            summary: "5 Years Manufacturer Warranty",
            serviceType: "On-site Service",
            covered: "Manufacturing Defects",
            notCovered: "Physical Damage",
            domesticWarranty: "5 Years",
          },
        },
      },
      {
        productName: "Wooden King Bed",
        productSubtitle: "Solid Wood King Size Bed with Storage",
        productImages: ["bed1.jpg", "bed2.jpg"],
        productPrice: 1500,
        productQuantity: 5,
        productSale: 5,
        productCategories: [categories[1]._id],
        productDescription:
          "A sturdy and elegant wooden king-size bed with storage drawers.",
        colors: ["Mahogany", "Walnut"],
        sizes: ["King"],
        brand: "WoodCraft",
        additionalInformation: {
          general: {
            salesPackage: "1 Bed Frame, Storage Drawers",
            modelNumber: "WD2023",
            secondaryMaterial: "Plywood",
            configuration: "Storage Bed",
            upholsteryMaterial: "None",
            upholsteryColor: "N/A",
          },
          productDetails: {
            fillingMaterial: "N/A",
            finishType: "Glossy",
            adjustableHeadrest: false,
            maximumLoadCapacity: 500,
            originOfManufacture: "India",
          },
          dimensions: {
            width: 200,
            height: 120,
            depth: 220,
            seatHeight: 50,
            legHeight: 15,
          },
          materials: {
            primaryMaterial: "Solid Wood",
            upholsteryMaterial: "None",
            upholsteryColor: "N/A",
            fillingMaterial: "N/A",
            finishType: "Glossy",
          },
          specifications: {
            adjustableHeadrest: false,
            maximumLoadCapacity: 500,
            originOfManufacture: "India",
            weight: 80,
            brand: "WoodCraft",
          },
          warranty: {
            summary: "3 Years Manufacturer Warranty",
            serviceType: "Doorstep Repair",
            covered: "Manufacturing Defects",
            notCovered: "Wear and Tear",
            domesticWarranty: "3 Years",
          },
        },
      },
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
