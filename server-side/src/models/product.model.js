const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    productName: { type: String, required: true },
    productImages: [{ type: String }],
    productPrice: { type: Number, required: true },
    productQuantity: { type: Number, required: true },
    productDate: { type: Date, default: Date.now },
    productSale: { type: Number, default: 0 },
    productCategories: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    ],
    productDescription: { type: String },
    // stockStatus: {
    //   type: String,
    //   enum: ["in stock", "out of stock"],
    //   default: "in stock",
    // },
    dimensions: { width: Number, height: Number, depth: Number },
    material: { type: String },
    color: { type: String }, /// should we put fixed colors
    brand: { type: String },
    // ratings: { average: Number, totalReviews: Number },
    imgs: [{ type: String }],
    reviews: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        review: { type: String },
        rating: { type: Number },
      },
    ],
  },
  { timestamps: true }
);
module.exports = mongoose.model("Product", ProductSchema);
