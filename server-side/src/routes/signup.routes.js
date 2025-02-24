const express = require("express");
const router = express.Router();

const signup = require("../controllers/signup.controller");
router.post("/", signup);

module.exports = router;
