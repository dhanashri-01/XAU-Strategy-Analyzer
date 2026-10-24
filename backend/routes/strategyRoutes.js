const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const optionalFirebaseAuth = require("../middlewares/optionalAuthMiddleware");
const { runStrategy, uploadCSV } = require("../controllers/strategyController");

router.get("/", (_req, res) => res.send("Strategy API Working"));

router.post("/upload", (req, res, next) => {
  upload.single("csv")(req, res, (error) => {
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.code === "LIMIT_FILE_SIZE"
          ? "The CSV must be 25 MB or smaller."
          : error.message || "CSV upload failed.",
      });
    }
    next();
  });
}, uploadCSV);

router.post("/run", optionalFirebaseAuth, runStrategy);

module.exports = router;
