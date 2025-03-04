const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

router.route("/").get(userController.getAllUsers);
router
  .route("/:userId")
  .get(userController.getUser)
  .patch(userController.editUser)
  .delete(userController.deleteUser);

module.exports = router;
