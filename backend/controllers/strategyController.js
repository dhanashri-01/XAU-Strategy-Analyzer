const runPython = require("../services/pythonRunner");
const History = require("../models/History");
// Upload CSV
const uploadCSV = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "CSV Not Uploaded",
    });
  }

  res.json({
    success: true,
    filename: req.file.filename,
    filepath: req.file.path,
  });
};

// Run Strategy
const runStrategy = async (req, res) => {
  try {
    const csvPath = req.body.csvPath;

    const settings = req.body;

    const result = await runPython(csvPath, settings);
    await History.create({
        userId: req.user.uid,
        slowEMA: Number(settings.slowEMA),
        londonStart: settings.londonStart,
        londonEnd: settings.londonEnd,
        newYorkStart: settings.newYorkStart,
        newYorkEnd: settings.newYorkEnd,
        trendFilter: Boolean(settings.trendFilter),
        confirmation: Boolean(settings.confirmation),
        fib618: Boolean(settings.fib618),
        bullish: Boolean(settings.bullish),
        bearish: Boolean(settings.bearish),
        fastEMA: Number(settings.fastEMA),
        minCandles: Number(settings.minCandles),
        fibLevel: Number(settings.fibLevel),
        slRatio: Number(settings.slRatio),
        rr: Number(settings.rr),

        signal: result.signal,

        entry: result.entry,
        stopLoss: result.stopLoss,
        target: result.target,

        accuracy: result.accuracy,
        wins: result.wins,
        losses: result.losses,
        trades: result.trades,
        netRR: result.netRR,

        equityCurve: result.equityCurve || [],
        tradeLog: result.tradeLog || [],

      });
    res.json(result);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      error: err.toString(),
    });
  }
};

module.exports = {
  uploadCSV,
  runStrategy,
};

