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
