const express = require("express");

const verifyFirebaseToken = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const {
  getOrCreateUser,
  uploadProfilePhoto
} = require("../controllers/userController");

const router = express.Router();

router.get(
  "/me",
  verifyFirebaseToken,
  getOrCreateUser
);

router.post(
  "/profile-photo",
  verifyFirebaseToken,
  upload.single("photo"),
  uploadProfilePhoto
);

module.exports = router;