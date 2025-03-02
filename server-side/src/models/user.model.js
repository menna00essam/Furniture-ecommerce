const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    password: { type: String, required: true },

    favourites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    // cart: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],   // carttt after iftar

    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
