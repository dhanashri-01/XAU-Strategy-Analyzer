const { initializeApp, cert, getApps } = require("firebase-admin/app");
const fs = require("fs");
const path = require("path");

const serviceAccountPath = path.resolve(__dirname, "./firebaseServiceAccount.json");

let adminApp = null;
if (fs.existsSync(serviceAccountPath)) {
  try {
    const serviceAccount = require(serviceAccountPath);
    if (!getApps().length) {
      adminApp = initializeApp({
        credential: cert(serviceAccount)
      });
    } else {
      adminApp = getApps()[0];
    }
  } catch (error) {
    console.warn("Could not initialize Firebase Admin with service account:", error.message);
  }
}

if (!adminApp && !getApps().length) {
  try {
    const projectId = process.env.FIREBASE_PROJECT_ID || "xau-strategy-analyzer";
    adminApp = initializeApp({ projectId });
  } catch (error) {
    console.warn("Could not initialize Firebase Admin with projectId:", error.message);
  }
} else if (!adminApp && getApps().length) {
  adminApp = getApps()[0];
}

module.exports = adminApp;
