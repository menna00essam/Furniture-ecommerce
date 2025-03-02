const mongoose = require("mongoose");

// const UserSchema = new mongoose.Schema({
//   fName: String,
//   lName: String,
//   email: String,
//   password: String,
//   isAdmin: { type: Boolean, default: false },
// });
// module.exports = mongoose.model("User", UserSchema);
const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    password: { type: String, required: true },
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      zipCode: { type: String },
      country: { type: String },
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
