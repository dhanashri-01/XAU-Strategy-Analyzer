const { verifyOrDecodeToken } = require("./tokenService");

const verifyFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authentication token required. Sign in to view history." });
  }

  const token = authHeader.slice("Bearer ".length).trim();
  try {
    req.user = await verifyOrDecodeToken(token);
    return next();
  } catch (error) {
    console.error("Firebase authentication error:", error.message);
    return res.status(401).json({ message: error.message || "Invalid or expired authentication token" });
  }
};

module.exports = verifyFirebaseToken;
