const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      console.error(error);
      // Check if token expired vs invalid
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ msg: "Token expired", expired: true });
      }
      res.status(401).json({ msg: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ msg: "Not authorized, no token" });
  }
};

// Verify refresh token middleware
const verifyRefreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ msg: "No refresh token" });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(401).json({ msg: "Invalid refresh token" });
  }
};

module.exports = { protect, verifyRefreshToken };
