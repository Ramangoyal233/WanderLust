const express = require("express");
const router = express.Router();
const User = require("../models/user.js")
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js"); 
const usercontroller = require("../controllers/user.js") 

router.route("/signup")
.get(usercontroller.renderSignForm)
.post(wrapAsync(usercontroller.signup));

router.route("/login")
.get(usercontroller.renderLoginForm )
.post(saveRedirectUrl,
    passport.authenticate("local",{
        failureFlash:true,
        failureRedirect:"/login"
    }),usercontroller.Login
   );

router.get("/logout",usercontroller.logout )

module.exports = router;
