const jwt = require("jsonwebtoken");
const User = require("../Models/userModel");
const { JWT_SECRET_KEY } = process.env;

const maxAge = 3 * 24 * 60 * 60;
exports.createToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET_KEY, {
    expiresIn: maxAge,
  });
};

exports.auth = (request, response, next) => {
  const token = request.cookies.jwt;

  if (token) {
    jwt.verify(token, JWT_SECRET_KEY, async (err, decodedToken) => {
      if (err) {
        response.status(401).json({ error: err.message });
      } else {
        const user = await User.findById(decodedToken.id);
        // id = user;
        request.user = user;
      }
      next();
    });
  } else {
    response.status(401).json({ message: "Sign In" });
  }
};
