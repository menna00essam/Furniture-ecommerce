const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  fName: String,
  lName: String,
  email: String,
  password: String,
  isAdmin: { type: Boolean, default: false },
});
module.exports = mongoose.model("User", UserSchema);
