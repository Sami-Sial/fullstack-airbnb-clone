const express = require("express");
const app = express();
const User = require("../models/user.model.js");
const passport = require("passport");
const bcrypt = require("bcrypt");

module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.registerUser = async (req, res) => {
  let { username, email, password } = req.body;
  let isAlreadyRegistered = await User.findOne({ profileId: email });
  console.log(isAlreadyRegistered);

  if (isAlreadyRegistered) {
    req.flash("error", "A User with given Email already exists.");
    res.redirect("/signup");
  } else {
    bcrypt.hash(password, 10, function (err, hash) {
      saveUser(hash);
    });

    const saveUser = async (hashedPass) => {
      let user = new User({
        email,
        username,
        password: hashedPass,
        profileId: email,
      });
      let registeredUser = await user.save();

      req.login(registeredUser, (err) => {
        if (err) {
          next(err);
        }
        req.flash("success", "Welcome to Wnderlust!");
        res.redirect("/listings");
      });
    };
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.logoutuser = (req, res, next) => {
  console.log(req.user.provider);

  req?.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Logged you out.");
    res.redirect("/login");
  });
};

module.exports.renderMyProperties = async (req, res) => {
  const id = req.user._id;
  let myProperties = await Listing.find({ id });
  console.log(myProperties);

  res.render("listings/myproperties.ejs", { myProperties });
};

module.exports.renderMyReservations = async (req, res) => {
  const id = req.user._id;
  let myProperties = await Listing.find({ id });
  console.log(myProperties);

  res.render("listings/reservations.ejs", { myProperties });
};
