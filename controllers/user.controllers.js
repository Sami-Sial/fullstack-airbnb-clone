const User = require("../models/user.model.js");
const passport = require("passport");


module.exports.renderSignupForm = (req,res) => {
    res.render("users/signup.ejs");
}

module.exports.registerUser = async (req, res) => {
    let { email } = req.body;
    let isAlreadyRegistered = await User.findOne({ email });
    if (isAlreadyRegistered) {
        req.flash("error", "A User with given Email already exists.");
        res.redirect("/signup");
    }

    try{
      let {username,email,password} = req.body;
      let newUser = new User({email, username});
      let registeredUser = await User.register(newUser,password);
      req.login(registeredUser, (err) => {
        if(err){
          next(err);
        }
        req.flash("success", "Welcome to Wnderlust!");
        res.redirect("/listings");
      })
    }catch(e){
      req.flash("error", e.message);
      res.redirect("/signup");
    }
  }

module.exports.renderLoginForm = (req,res) => {
  res.render("users/login.ejs");
}

module.exports.logoutuser = (req,res,next) => {
    req.logout((err) => {
      if(err){
        return next(err);
      }
      req.flash("success", "Logged you out.");
      res.redirect("/listings");
    })
  }