const History = require("../models/History");

const getHistory = async (req, res) => {

  try {

    const history = await History.find({ userId: req.user.uid }).sort({
      createdAt: -1,
    });

    res.json(history);

  } catch (err) {

    res.status(500).json({
      success: false,
      error: err.message,
    });

  }

};

module.exports = {
  getHistory,
};
