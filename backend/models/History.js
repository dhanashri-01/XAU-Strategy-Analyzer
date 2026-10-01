const mongoose = require("mongoose");

const HistorySchema = new mongoose.Schema(
  {
    fastEMA: Number,
    minCandles: Number,
    fibLevel: Number,
    slRatio: Number,
    rr: Number,

    signal: String,

    entry: Number,
    stopLoss: Number,
    target: Number,

    accuracy: Number,
    wins: Number,
    losses: Number,
    trades: Number,
    netRR: Number,

    equityCurve: {
      type: Array,
      default: [],
    },

    tradeLog: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("History", HistorySchema);