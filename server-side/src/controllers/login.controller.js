const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Login Route POST (/login)
const login = async (req, res) => {
  // get user data
  const user = req.body;
  // search user
  let foundedUser = await userModel.findOne({
    email: user.email.toLowerCase(),
  });
  //   if not exist
  if (!foundedUser) {
    return res.status(404).json({ message: "Invalid email or password" });
  }
  //   check the password
  let isMatch = await bcrypt.compare(user.password, foundedUser.password);
  //   if password is not match
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  //   create and send jwt token in header
  const token = await jwt.sign({ isAdmin: foundedUser.isAdmin }, "furnatiaro");
  res.header("x-auth-token", token);

  res.json({ message: "Logged in successfully" });
};
module.exports = login;
