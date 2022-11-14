const authController = require("../Controllers/authController");
const express = require("express");
const { auth } = require("../middlewares/authMiddleware");

const router = express.Router();

const { signIn, signUp, logout, deleteUser } = authController;

router.post("/signup", signUp);

router.post("/signin", signIn);

router.post("/logout/:id", auth, logout);
router.delete("/delete", auth, deleteUser);

module.exports = router;
