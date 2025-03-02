const express = require("express");
const router = express.Router();

// 1- getall categories
router.route("/").get();

module.exports = router;
