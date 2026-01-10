const jwt = require("jsonwebtoken");

// Access token - short-lived (15 minutes)
const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
};

// Refresh token - long-lived (7 days)
const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
};

// Legacy function for backward compatibility
const generateToken = (userId) => {
  return generateAccessToken(userId);
};

module.exports = { generateToken, generateAccessToken, generateRefreshToken };
