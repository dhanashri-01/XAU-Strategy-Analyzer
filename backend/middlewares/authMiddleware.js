const { getAuth } = require("firebase-admin/auth");

const getAdminAuth = () => {
  require("../config/firebaseAdmin");
  return getAuth();
};

const verifyFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authentication token required" });
  }

  try {
    req.user = await getAdminAuth().verifyIdToken(authHeader.slice("Bearer ".length));
    return next();
  } catch (error) {
    if (error.code === "app/invalid-credential" || error.code === "app/no-app") {
      console.error("Firebase Admin authentication is not configured:", error.message);
      return res.status(503).json({ message: "Account services are temporarily unavailable." });
    }
    console.error("Firebase authentication error:", error.message);
    return res.status(401).json({ message: "Invalid or expired authentication token" });
  }
};

module.exports = verifyFirebaseToken;
