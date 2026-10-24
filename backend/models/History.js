const mongoose = require("mongoose");

const HistorySchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    slowEMA: Number,
    londonStart: String,
    londonEnd: String,
    newYorkStart: String,
    newYorkEnd: String,
    trendFilter: Boolean,
    confirmation: Boolean,
    fib618: Boolean,
    bullish: Boolean,
    bearish: Boolean,
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
