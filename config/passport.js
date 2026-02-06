const express = require("express");
const app = express();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const User = require("../models/user.model");
const LocalStrategy = require("passport-local");
const GithubStategy = require("passport-github").Strategy;
const bcrypt = require("bcrypt");

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ email: username });

      if (!user) {
        return done(null, false, { message: "Invalid email or password" });
      }

      bcrypt.compare(password, user.password, (err, result) => {
        if (err) return done(err);

        if (!result) {
          return done(null, false, { message: "Invalid email or password" });
        }

        return done(null, user);
      });
    } catch (err) {
      return done(err);
    }
  })
);


passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID, // Your Credentials here.
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Your Credentials here.
      callbackURL: `${process.env.BACKEND_BASE_URL}/auth/google/callback`,
      passReqToCallback: true,
    },
    async function (request, accessToken, refreshToken, profile, done) {
      console.log(profile);

      const isUserAlreadyExist = await User.findOne({ profileId: profile.id });

      if (isUserAlreadyExist) {
        return done(null, isUserAlreadyExist);
      } else {
        let newUser = new User({
          username: profile.displayName,
          email: profile.email,
          provider: profile.provider,
          profileId: profile.id,
        });

        let user = await newUser.save();

        return done(null, user);
      }
    }
  )
);

passport.use(
  new GithubStategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID, // Your Credentials here.
      clientSecret: process.env.GITHUB_CLIENT_SECRET, // Your Credentials here.
      callbackURL: `${process.env.BACKEND_BASE_URL}/auth/github/callback`,
      passReqToCallback: true,
    },
    async function (req, accessToken, refreshToken, profile, done) {
      console.log(profile);

      const isUserAlreadyExist = await User.findOne({ profileId: profile.id });

      if (isUserAlreadyExist) {
        return done(null, isUserAlreadyExist);
      } else {
        let newUser = new User({
          username: profile.displayName,
          email: profile.emails[0].value,
          provider: profile.provider,
          profileId: profile.id,
        });

        let user = await newUser.save();

        return done(null, user);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser(function (user, done) {
  done(null, user);
});
