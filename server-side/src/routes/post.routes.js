const express = require("express");
const router = express.Router();

router.route("/").get().post().delete();
router.route("/recent").get();

module.exports = router;
