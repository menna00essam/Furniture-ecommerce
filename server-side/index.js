const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const PORT = process.env.PORT || 5000;

/ * * * * DB * * * /;
const connectDB = require("./src/config/db");
/ * * * * End Db * * * * /;

/ * * * * Router imports * * * * /;
///1- user router
const signupRouter = require("./src/routes/signup.routes");
const loginRouter = require("./src/routes/login.routes");
//2-
/ * * * * End Router imports * * * * /;

// Connect to MongoDB
connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//  Hello world
app.get("/", (req, res) => {
  res.json("Hello in nodejs-app-starter");
});

// user registeration route
app.use("/signup", signupRouter);
app.use("/login", loginRouter);

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
