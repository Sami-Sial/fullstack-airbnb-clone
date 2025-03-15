const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { validateUser, isLoggedIn } = require("../middlewares/middleware.js");
const { saveRedirectUrl } = require("../middlewares/middleware.js");
const {
  renderSignupForm,
  registerUser,
  renderLoginForm,
  logoutuser,
  loginUser,
} = require("../controllers/user.controllers.js");
require("../config/passport.js");

const router = express.Router();

router.use(passport.initialize());
router.use(passport.session());

router.route("/signup").get(renderSignupForm).post(wrapAsync(registerUser));

router
  .route("/login")
  .get(renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    (req, res) => {
      req.flash("success", "Login scuccessfull. Welcome to Wanderlust");
      let redirectUrl = res.locals.redirectUrl || "/listings";
      res.redirect(redirectUrl);
    }
  );

router.get("/logout", isLoggedIn, logoutuser);

// Google Auth
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

// Google Auth Callback
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    req.flash("success", "Welcome to Wanderlust");
    res.redirect("/listings");
  }
);

// Github Auth
router.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["email", "profile"] })
);

// Github Auth Callback
router.get(
  "/auth/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    req.flash("success", "Welcome to Wanderlust");
    res.redirect("/listings");
  }
);

module.exports = router;
