require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 5000;
const connectDB = require("./config/db");

// Connect to MongoDB
connectDB();
// {
//   origin: "http://localhost:4200", // Allow requests from this origin
//   methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
//   credentials: true, // Allow cookies and credentials
// }
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Default Route GET (/)
app.get("/", (req, res) => {
  res.send("Hello in nodejs-app-starter");
});

// signup Route
const signupRouter = require("./routes/signup.routes");
app.use("/signup", signupRouter);

// login Route
const loginRouter = require("./routes/login.routes");
app.use("/login", loginRouter);

app.listen(PORT, () => console.log(`https://localhost:${PORT}`));
