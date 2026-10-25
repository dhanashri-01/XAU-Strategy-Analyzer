const mongoose = require("mongoose");
const History = require("../models/History");

const getHistory = async (req, res) => {
  try {
    if (!req.user?.uid) {
      return res.status(401).json({
        success: false,
        message: "Sign in to view your strategy history.",
      });
    }

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: "Database is not connected. Make sure MongoDB is running to view saved history.",
      });
    }

    const history = await History.find({ userId: req.user.uid }).sort({
      createdAt: -1,
    });

    return res.json(history);
  } catch (err) {
    console.error("Failed to retrieve history:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to retrieve history from database.",
    });
  }
};

module.exports = {
  getHistory,
};
