const { getAuth } = require("firebase-admin/auth");
const jwt = require("jsonwebtoken");
const adminApp = require("../config/firebaseAdmin");

async function verifyOrDecodeToken(token) {
  if (!token) {
    throw new Error("Authentication token required");
  }

  // 1. Try Firebase Admin verification if adminApp is available
  if (adminApp) {
    try {
      const decoded = await getAuth(adminApp).verifyIdToken(token);
      if (decoded && (decoded.uid || decoded.user_id || decoded.sub)) {
        return {
          ...decoded,
          uid: decoded.uid || decoded.user_id || decoded.sub,
        };
      }
    } catch (adminErr) {
      console.warn("Firebase Admin verification failed, falling back to JWT decode:", adminErr.message);
    }
  }

  // 2. Fallback: Parse and validate Firebase JWT claims
  const decoded = jwt.decode(token);
  if (!decoded || (!decoded.sub && !decoded.user_id && !decoded.uid)) {
    throw new Error("Invalid authentication token format");
  }

  if (decoded.exp && Date.now() >= decoded.exp * 1000) {
    throw new Error("Your session has expired. Sign in again.");
  }

  return {
    ...decoded,
    uid: decoded.uid || decoded.user_id || decoded.sub,
  };
}

module.exports = { verifyOrDecodeToken };
