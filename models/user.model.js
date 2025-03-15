const { required } = require("joi");
const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: String,
  username: {
    type: String,
    required: true,
  },
  provider: {
    type: String,
    default: "email",
  },
  profileId: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
