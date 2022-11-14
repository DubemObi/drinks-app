const User = require("../Models/userModel");
const bcrypt = require("bcrypt");
const handleError = require("../utils/error");
const { createToken } = require("../middlewares/authMiddleware");

//Cookie Availability Span
const maxAge = 3 * 24 * 60 * 60;

exports.signUp = async (req, res) => {
  try {
    const { fullname, email, password, confirmPassword, phoneNumber } =
      req.body;
    if (password !== confirmPassword) {
      res.status(400).json({ message: "Wrong Password input" });
    }
    const salt = await bcrypt.genSalt(10);

    if (password === confirmPassword && password.length > 5) {
      const hash = await bcrypt.hash(password, salt);
      const user = await User.create({
        fullname,
        email,
        password: hash,
        confirmPassword: hash,
        phoneNumber
      });

      const token = createToken(user._id);
      res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
      return res.status(201).json({
        status: "success",
        token,
        data: {
          user,
        },
      });
    }
    return res
      .status(400)
      .json({ message: "Password is less than 6 characters" });
  } catch (error) {
    const errors = handleError(error);
    res.status(404).json({ errors });
  }
};

//Log user in
exports.signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      res.status(401).json({
        status: "fail",
        message: "Invalid email or password",
      });
    }

    if (user) {
      const auth = await bcrypt.compare(password, user.password);
      if (auth) {
        const token = await createToken(user._id);
        res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json({
          status: "success",
          token,
          data: {
            user,
          },
        });
      } else {
        res.status(401).json({
          status: "fail",
          message: "Invalid email or password",
        });
      }
    }
  } catch (err) {
    const errors = handleError(err);
    res.status(400).json({
      status: "fail",
      message: errors,
    });
  }
};

//Logout
exports.logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 1 });
    res.status(200).json({ message: "You've successfully logged out" });
  } catch (error) {
    res.status(404).json({ message: "Account not logged out" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findOneAndDelete({ _id: req.user.id });
    if (!deletedUser) {
      await Token.findOneAndDelete({ userId: req.user.id });
      return res.status(400).json({ message: "unable to delete account" });
    }
    return res.status(200).json({
      success: true,
      message: "account deleted",
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
