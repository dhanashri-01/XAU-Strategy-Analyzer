const { getAuth } = require("firebase-admin/auth");

const getAdminAuth = () => {
  require("../config/firebaseAdmin");
  return getAuth();
};

const optionalFirebaseAuth = async (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) return next();
  if (!authorization.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Invalid authentication header." });
  }

  try {
    req.user = await getAdminAuth().verifyIdToken(authorization.slice("Bearer ".length));
    return next();
  } catch (error) {
    if (error.code === "app/invalid-credential" || error.code === "app/no-app") {
      return res.status(503).json({ success: false, message: "Account services are temporarily unavailable." });
    }
    return res.status(401).json({ success: false, message: "Your session has expired. Sign in again." });
  }
};

module.exports = optionalFirebaseAuth;
