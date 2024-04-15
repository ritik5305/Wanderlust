const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");

const userController=require("../controller/users.js");
const wrapAsync = require("../utils/wrapAsync.js");


router.route("/signup")
.get(userController.renderSignup)
.post(userController.signup );

router.route("/login")
.get(userController.renderLoginForm)
.post(
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userController.Login
);


router.get("/logout",userController.logOut);


module.exports = router;
