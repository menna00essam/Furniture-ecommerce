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
    encryptedPass: { type: String, required: true },
    phone: { type: String },
    role: { type: String, enum: ["admin", "customer"], default: "customer" },
    favourites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: true }
);
module.exports = mongoose.model("User", UserSchema);
