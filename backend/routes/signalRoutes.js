const express = require("express");
const router = express.Router();

const {
  getLiveSignal,
  streamLiveSignals,
  updateLiveSettings,
} = require("../controllers/signalController");

router.get("/live", getLiveSignal);
router.get("/stream", streamLiveSignals);
router.post("/settings", updateLiveSettings);

module.exports = router;

