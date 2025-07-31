// This ensures only authenticated users can access the profile endpoints

const jwt = require("jsonwebtoken");
const CustomError = require("../utils/customError");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return next(new CustomError("Access Denied: No token provided", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(new CustomError("Token has expired", 401));
    }
    if (error.name === 'JsonWebTokenError') {
      return next(new CustomError("Invalid token", 403));
    }
    return next(new CustomError("Token verification failed", 403));
  }
};

module.exports = verifyToken;
