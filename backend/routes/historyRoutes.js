const express = require("express");
const verifyFirebaseToken = require("../middlewares/authMiddleware");

const router = express.Router();

const {
  getHistory,
} = require("../controllers/historyController");

router.get("/", verifyFirebaseToken, getHistory);

module.exports = router;
