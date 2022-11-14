const mongoose = require("mongoose");
const { isEmail } = require("validator");

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: [true, "Please enter a Fullname"],
    minlength: [6, "Fullname should have more than 6 characters"],
    maxlength: [30, "Fullname should be more than 30 characters"],
  },
  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Password field is required"],
    minlength: [6, "Password is less than 6 characters"],
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [
      true,
      "Wrong! make sure input is of the same characters with password",
    ],
    minlength: [6, "Password is less than 6 characters"],
    select: false,
  },
  phoneNumber: {
    type: String,
    required: true,
    minlength: [11, "Input a correct phone number"],
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
