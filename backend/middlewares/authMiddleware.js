const { getAuth } = require("firebase-admin/auth");

require("../config/firebaseAdmin");

const adminAuth = getAuth();

const verifyFirebaseToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authentication token required"
      });
    }

    const idToken = authHeader.split("Bearer ")[1];

    const decodedToken = await adminAuth.verifyIdToken(idToken);

    req.user = decodedToken;

    next();
  } catch (error) {
    console.error(
      "Firebase authentication error:",
      error.message
    );

    return res.status(401).json({
      message: "Invalid or expired authentication token"
    });
  }
};

module.exports = verifyFirebaseToken;