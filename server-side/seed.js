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
    const categories = await Category.insertMany([
      {
        catName: "armchairs",
        description:
          " Armchairs are comfortable, upholstered chairs designed for relaxation and style. They come in various designs, materials, and colors, making them versatile for any room.",
        image:
          "https://res.cloudinary.com/dddhappm3/image/upload/v1743873075/landskrona-6_dyifrd.jpg",
      },
    ]);

    // ======================
    // 3. Create Products
    // ======================

    // const products = await Product.insertMany([
    //   {
    //     productName: "smedstorp",
    //     productSubtitle: "smedstorp unique experience for your comfort",
    //     productPrice: 1900.99,
    //     productSale: 15,
    //     productCategories: ["67e692e984d799deabb3f06e"],
    //     productDescription:
    //       "The Smedstorp sofa combines modern elegance with everyday comfort, making it a standout addition to any living room. Featuring premium fabric upholstery, it delivers a smooth, refined texture that's both durable and inviting. Its sleek silhouette, clean lines, and supportive cushioning provide a balanced blend of style and relaxation. Available in two rich tones—dark gray for a sophisticated, minimalist feel, and dark blue for a bold yet calming touch—the Smedstorp sofa brings a contemporary charm to your home while ensuring comfort that lasts. Whether you're hosting friends or enjoying a quiet evening, this sofa is designed to enhance your living space with its timeless appeal and practical functionality.",
    //     brand: "IkEA",
    //     colors: [
    //       {
    //         name: "Dark Gray",
    //         hex: "#333333",

    //         images: [
    //           {
    //             public_id:
    //               "categories/sofas/smedstorp/dark gray/smedstorp-2_uxtqfw",
    //             url: "https://res.cloudinary.com/dddhappm3/image/upload/v1743871503/categories/sofas/smedstorp/dark%20gray/smedstorp-2_uxtqfw.jpg",
    //           },
    //           {
    //             public_id:
    //               "categories/sofas/smedstorp/dark gray/smedstorp-4_g9zmk8",
    //             url: "https://res.cloudinary.com/dddhappm3/image/upload/v1743871501/categories/sofas/smedstorp/dark%20gray/smedstorp-4_g9zmk8.jpg",
    //           },
    //           {
    //             public_id:
    //               "categories/sofas/smedstorp/dark gray/smedstorp-3_xrvwsi",
    //             url: "https://res.cloudinary.com/dddhappm3/image/upload/v1743871501/categories/sofas/smedstorp/dark%20gray/smedstorp-3_xrvwsi.jpg",
    //           },
    //           {
    //             public_id:
    //               "categories/sofas/smedstorp/dark gray/smedstorp-5_biljob",
    //             url: "https://res.cloudinary.com/dddhappm3/image/upload/v1743871495/categories/sofas/smedstorp/dark%20gray/smedstorp-5_biljob.jpg",
    //           },
    //           {
    //             public_id:
    //               "categories/sofas/smedstorp/dark gray/smedstorp-6_bvun2e",
    //             url: "https://res.cloudinary.com/dddhappm3/image/upload/v1743871490/categories/sofas/smedstorp/dark%20gray/smedstorp-6_bvun2e.jpg",
    //           },
    //           {
    //             public_id:
    //               "categories/sofas/smedstorp/dark gray/smedstorp-1_cfd2lk",
    //             url: "https://res.cloudinary.com/dddhappm3/image/upload/v1743871479/categories/sofas/smedstorp/dark%20gray/smedstorp-1_cfd2lk.jpg",
    //           },
    //         ],
    //         quantity: 6,
    //       },
    //       {
    //         name: "Dark Blue",
    //         hex: "#0000FF",

    //         images: [
    //           {
    //             public_id:
    //               "categories/sofas/smedstorp/dark blue/smedstorp-5_vyl6bu",
    //             url: "https://res.cloudinary.com/dddhappm3/image/upload/v1743871593/categories/sofas/smedstorp/dark%20blue/smedstorp-5_vyl6bu.jpg",
    //           },
    //           {
    //             public_id:
    //               "categories/sofas/smedstorp/dark blue/smedstorp-2_q2od9s",
    //             url: "https://res.cloudinary.com/dddhappm3/image/upload/v1743871591/categories/sofas/smedstorp/dark%20blue/smedstorp-2_q2od9s.jpg",
    //           },
    //           {
    //             public_id:
    //               "categories/sofas/smedstorp/dark blue/smedstorp-3_o2y8hh",
    //             url: "https://res.cloudinary.com/dddhappm3/image/upload/v1743871590/categories/sofas/smedstorp/dark%20blue/smedstorp-3_o2y8hh.jpg",
    //           },
    //           {
    //             public_id:
    //               "categories/sofas/smedstorp/dark blue/smedstorp-6_ap5orh",
    //             url: "https://res.cloudinary.com/dddhappm3/image/upload/v1743871584/categories/sofas/smedstorp/dark%20blue/smedstorp-6_ap5orh.jpg",
    //           },
    //           {
    //             public_id:
    //               "categories/sofas/smedstorp/dark blue/smedstorp-4_gmoerw",
    //             url: "https://res.cloudinary.com/dddhappm3/image/upload/v1743871579/categories/sofas/smedstorp/dark%20blue/smedstorp-4_gmoerw.jpg",
    //           },
    //           {
    //             public_id:
    //               "categories/sofas/smedstorp/dark blue/smedstorp-1_kqekak",
    //             url: "https://res.cloudinary.com/dddhappm3/image/upload/v1743871574/categories/sofas/smedstorp/dark%20blue/smedstorp-1_kqekak.jpg",
    //           },
    //         ],
    //         quantity: 10,
    //       },
    //     ],

    //     additionalInformation: {
    //       general: {
    //         salesPackage: "3 Sofa",
    //         modelNumber: "SOFA-123",
    //         configuration: "Fixed  Seat",
    //         upholsteryMaterial: "Velvet",
    //         upholsteryColor: "Black",
    //       },
    //       productDetails: {
    //         fillingMaterial: "Foam",
    //         finishType: "Matte",
    //         adjustableHeadrest: false,
    //         maximumLoadCapacity: 300,
    //         originOfManufacture: "USA",
    //       },
    //       dimensions: {
    //         width: 200,
    //         height: 85,
    //         depth: 90,
    //         seatHeight: 45,
    //         legHeight: 10,
    //       },
    //       warranty: {
    //         summary: "1 Year Warranty",
    //         serviceType: "Onsite Service",
    //         covered: "Manufacturing Defects",
    //         notCovered: "Physical Damage",
    //         domesticWarranty: "Yes",
    //       },
    //     },
    //   },
    //   {
    //     productName: "landskrona",
    //     productSubtitle: "landskrona sofa is the best for you and your family",
    //     productPrice: 1900.99,
    //     productSale: 15,
    //     productCategories: ["67e692e984d799deabb3f06e"],
    //     productDescription:
    //       " The Landskrona sofa is a stylish and comfortable addition to any living space. With its modern design and premium fabric upholstery, it offers both elegance and durability. The sofa features a sleek silhouette with clean lines, providing a contemporary touch to your home. Available in two stunning colors—dark gray for a sophisticated look and light green for a refreshing vibe—the Landskrona sofa is perfect for relaxing or entertaining guests. Its plush cushions ensure maximum comfort, making it an ideal choice for lounging or hosting gatherings. Elevate your living room with the Landskrona sofa's timeless appeal and functional design.",
    //     brand: "IkEA",
    //     colors: [
    //       {
    //         name: "Dark Gray",
    //         hex: "#333333",

    //         images: [
    //           {
    //             public_id:
    //               "categories/armchairs/landskrona/dark gray/landskrona-4_rfgaxm",
    //             url: "https://res.cloudinary.com/dddhappm3/image/upload/v1743871760/categories/armchairs/landskrona/dark%20gray/landskrona-4_rfgaxm.jpg",
    //           },
    //           {
    //             public_id:
    //               "categories/armchairs/landskrona/dark gray/landskrona-3_e86rz5",
    //             url: "https://res.cloudinary.com/dddhappm3/image/upload/v1743871758/categories/armchairs/landskrona/dark%20gray/landskrona-3_e86rz5.jpg",
    //           },
    //           {
    //             public_id:
    //               "categories/armchairs/landskrona/dark gray/landskrona-2_ysltji",
    //             url: "https://res.cloudinary.com/dddhappm3/image/upload/v1743871758/categories/armchairs/landskrona/dark%20gray/landskrona-2_ysltji.jpg",
    //           },
    //           {
    //             public_id:
    //               "categories/armchairs/landskrona/dark gray/landskrona-5_ewtsgk",
    //             url: "https://res.cloudinary.com/dddhappm3/image/upload/v1743871755/categories/armchairs/landskrona/dark%20gray/landskrona-5_ewtsgk.jpg",
    //           },
    //           {
    //             public_id:
    //               "categories/armchairs/landskrona/dark gray/landskrona-1_sxdpte",
    //             url: "https://res.cloudinary.com/dddhappm3/image/upload/v1743871751/categories/armchairs/landskrona/dark%20gray/landskrona-1_sxdpte.jpg",
    //           },
    //           {
    //             public_id:
    //               "categories/armchairs/landskrona/dark gray/landskrona-6_pu48pz",
    //             url: "https://res.cloudinary.com/dddhappm3/image/upload/v1743871742/categories/armchairs/landskrona/dark%20gray/landskrona-6_pu48pz.jpg",
    //           },
    //           {
    //             public_id:
    //               "categories/sofas/landskrona/dark gray/landskrona-4_sof7hy",
    //             url: "https://res.cloudinary.com/dddhappm3/image/upload/v1743871384/categories/sofas/landskrona/dark%20gray/landskrona-4_sof7hy.jpg",
    //           },
    //           {
    //             public_id:
    //               "categories/sofas/landskrona/dark gray/landskrona-2_ff2iiq",
    //             url: "https://res.cloudinary.com/dddhappm3/image/upload/v1743871384/categories/sofas/landskrona/dark%20gray/landskrona-2_ff2iiq.jpg",
    //           },
    //           {
    //             public_id:
    //               "categories/sofas/landskrona/dark gray/landskrona-6_cutp1t",
    //             url: "https://res.cloudinary.com/dddhappm3/image/upload/v1743871382/categories/sofas/landskrona/dark%20gray/landskrona-6_cutp1t.jpg",
    //           },
    //           {
    //             public_id:
    //               "categories/sofas/landskrona/dark gray/landskrona-3_lfpwhi",
    //             url: "https://res.cloudinary.com/dddhappm3/image/upload/v1743871380/categories/sofas/landskrona/dark%20gray/landskrona-3_lfpwhi.jpg",
    //           },
    //           {
    //             public_id:
    //               "categories/sofas/landskrona/dark gray/landskrona-5_zqyqln",
    //             url: "https://res.cloudinary.com/dddhappm3/image/upload/v1743871373/categories/sofas/landskrona/dark%20gray/landskrona-5_zqyqln.jpg",
    //           },
    //           {
    //             public_id:
    //               "categories/sofas/landskrona/dark gray/landskrona-1_qkac5n",
    //             url: "https://res.cloudinary.com/dddhappm3/image/upload/v1743871367/categories/sofas/landskrona/dark%20gray/landskrona-1_qkac5n.jpg",
    //           },
    //         ],
    //         quantity: 8,
    //       },
    //       {
    //         name: "Light Green",
    //         hex: "#90EE90",

    //         images: [
    //           {
    //             public_id:
    //               "categories/armchairs/landskrona/light green/landskrona-5_o6mbvu",
    //             url: "https://res.cloudinary.com/dddhappm3/image/upload/v1743871818/categories/armchairs/landskrona/light%20green/landskrona-5_o6mbvu.jpg",
    //           },
    //           {
    //             public_id:
    //               "categories/armchairs/landskrona/light green/landskrona-6_buaefo",
    //             url: "https://res.cloudinary.com/dddhappm3/image/upload/v1743871816/categories/armchairs/landskrona/light%20green/landskrona-6_buaefo.jpg",
    //           },
    //           {
    //             public_id:
    //               "categories/armchairs/landskrona/light green/landskrona-1_vwpruz",
    //             url: "https://res.cloudinary.com/dddhappm3/image/upload/v1743871815/categories/armchairs/landskrona/light%20green/landskrona-1_vwpruz.jpg",
    //           },
    //           {
    //             public_id:
    //               "categories/armchairs/landskrona/light green/landskrona-4_ydeirq",
    //             url: "https://res.cloudinary.com/dddhappm3/image/upload/v1743871809/categories/armchairs/landskrona/light%20green/landskrona-4_ydeirq.jpg",
    //           },
    //           {
    //             public_id:
    //               "categories/armchairs/landskrona/light green/landskrona-3_q7etbn",
    //             url: "https://res.cloudinary.com/dddhappm3/image/upload/v1743871801/categories/armchairs/landskrona/light%20green/landskrona-3_q7etbn.jpg",
    //           },
    //           {
    //             public_id:
    //               "categories/armchairs/landskrona/light green/landskrona-2_uzyotg",
    //             url: "https://res.cloudinary.com/dddhappm3/image/upload/v1743871795/categories/armchairs/landskrona/light%20green/landskrona-2_uzyotg.jpg",
    //           },
    //           {
    //             public_id:
    //               "categories/sofas/landskrona/light green/landskrona-4_fjgugs",
    //             url: "https://res.cloudinary.com/dddhappm3/image/upload/v1743871440/categories/sofas/landskrona/light%20green/landskrona-4_fjgugs.jpg",
    //           },
    //           {
    //             public_id:
    //               "categories/sofas/landskrona/light green/landskrona-2_umrcrs",
    //             url: "https://res.cloudinary.com/dddhappm3/image/upload/v1743871440/categories/sofas/landskrona/light%20green/landskrona-2_umrcrs.jpg",
    //           },
    //           {
    //             public_id:
    //               "categories/sofas/landskrona/light green/landskrona-3_epwpjx",
    //             url: "https://res.cloudinary.com/dddhappm3/image/upload/v1743871434/categories/sofas/landskrona/light%20green/landskrona-3_epwpjx.jpg",
    //           },
    //           {
    //             public_id:
    //               "categories/sofas/landskrona/light green/landskrona-6_rbntbl",
    //             url: "https://res.cloudinary.com/dddhappm3/image/upload/v1743871434/categories/sofas/landskrona/light%20green/landskrona-6_rbntbl.jpg",
    //           },
    //           {
    //             public_id:
    //               "categories/sofas/landskrona/light green/landskrona-5_no0ifd",
    //             url: "https://res.cloudinary.com/dddhappm3/image/upload/v1743871425/categories/sofas/landskrona/light%20green/landskrona-5_no0ifd.jpg",
    //           },
    //           {
    //             public_id:
    //               "categories/sofas/landskrona/light green/landskrona-1_gjbcic",
    //             url: "https://res.cloudinary.com/dddhappm3/image/upload/v1743871420/categories/sofas/landskrona/light%20green/landskrona-1_gjbcic.jpg",
    //           },
    //         ],
    //         quantity: 12,
    //       },
    //     ],

    //     additionalInformation: {
    //       general: {
    //         salesPackage: "3 Sofa",
    //         modelNumber: "SOFA-123",
    //         configuration: "Fixed  Seat",
    //         upholsteryMaterial: "Velvet",
    //         upholsteryColor: "Black",
    //       },
    //       productDetails: {
    //         fillingMaterial: "Foam",
    //         finishType: "Matte",
    //         adjustableHeadrest: false,
    //         maximumLoadCapacity: 300,
    //         originOfManufacture: "USA",
    //       },
    //       dimensions: {
    //         width: 200,
    //         height: 85,
    //         depth: 90,
    //         seatHeight: 45,
    //         legHeight: 10,
    //       },
    //       warranty: {
    //         summary: "1 Year Warranty",
    //         serviceType: "Onsite Service",
    //         covered: "Manufacturing Defects",
    //         notCovered: "Physical Damage",
    //         domesticWarranty: "Yes",
    //       },
    //     },
    //   },
    // ]);

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
    // console.log(`Summary:
    //    Products: ${products.length}`);

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
