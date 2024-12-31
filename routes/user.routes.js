const express = require("express");
const wrapAsync = require ("../utils/wrapAsync.js");
const passport = require("passport");
const {validateUser} = require("../middlewares/middleware.js");
const {saveRedirectUrl} = require("../middlewares/middleware.js");
const { renderSignupForm, registerUser, renderLoginForm, logoutuser} = require("../controllers/user.controllers.js");

const router = express.Router();


router.route("/signup")
.get(renderSignupForm)
.post(wrapAsync(registerUser));

router.route("/login")
.get(renderLoginForm)
.post(saveRedirectUrl,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true
    }),
    (req,res) => {
        req.flash("success", "Login scuccessfull. Welcome to Wanderlust");
        let redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
    }
);

router.get("/logout", logoutuser)

module.exports = router;