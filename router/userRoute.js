var express = require("express");
var router = express.Router();
const auth = require("../config/Auth");
var userController = require("../controller/UserController");

router.post("/kayitol", userController.kayitOl);
router.post("/girisyap", userController.girisYap);

router
  .get("/users", userController.getUsers)
  .get("/users/:userid", userController.getUser)
  .put("/users/:userid", auth.verifyToken, userController.updateUser)
  .put("/change-password", auth.verifyToken, userController.changePassword)
  .get("/me", userController.loggedInUser);

module.exports = router;
