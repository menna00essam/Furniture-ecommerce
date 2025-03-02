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

/*
const userValidation = require("../utils/userValidation");
const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");

// User Signup Route POST (/signup)
const signup = async (req, res) => {
  //get user
  const user = req.body;
  // validate user data
  if (!userValidation(user)) {
    return res.status(400).json({ message: "Invalid user data." });
  }
  // check if user already exists by email
  let foundedUser = await userModel.findOne({
    email: user.email.toLowerCase(),
  });
  if (foundedUser) {
    return res
      .status(400)
      .json({ message: "User with this email already exists." });
  }
  // hash password
  let genSalt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, genSalt);
  // make user email letter lowerCase for checking
  user.email = user.email.toLowerCase();
  // save user to database
  userModel
    .create(user)
    .then((user) => {
      res.status(200).json({ message: "User registered successfully.", user });
    })
    .catch((error) => {
      res.status(500).json({ message: "Error registering user.", error });
    });
};
module.exports = signup;

*/
