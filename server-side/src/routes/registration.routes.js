const express = require("express");
const router = express.Router();
const registerationController = require("../controllers/registration.controller");
/*
1- registratiion
2- logn-in
3- log-out
4- forget-password
5- reset-password
*/

router.post("/signup", registerationController.signup);
router.post("/login", registerationController.login);
router.post("/forgot-password", registerationController.forgotPassword);
router.post("/reset-password", registerationController.resetPassword);
module.exports = router;
