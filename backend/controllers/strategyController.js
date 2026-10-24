const fs = require("fs");
const path = require("path");
const runPython = require("../services/pythonRunner");
const History = require("../models/History");

const uploadsDirectory = path.resolve(__dirname, "../uploads");

const uploadCSV = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "Choose a CSV file to upload." });
  }

  return res.status(201).json({
    success: true,
    filename: req.file.filename,
    filepath: req.file.path,
  });
};

const runStrategy = async (req, res) => {
  try {
    const submittedPath = req.body.csvPath;
    if (typeof submittedPath !== "string" || !submittedPath.trim()) {
      return res.status(400).json({ success: false, message: "Upload a CSV file before running the strategy." });
    }

    const csvPath = path.resolve(submittedPath);
    if (path.dirname(csvPath) !== uploadsDirectory || path.extname(csvPath).toLowerCase() !== ".csv") {
      return res.status(400).json({ success: false, message: "The selected CSV is invalid. Upload it again." });
    }
    if (!fs.existsSync(csvPath)) {
      return res.status(400).json({ success: false, message: "The uploaded CSV could not be found. Upload it again." });
    }

    const settings = req.body;
    const result = await runPython(csvPath, settings);
    let historySaved = false;
    let historyMessage = "Sign in to save this run to your history.";

    if (req.user?.uid) {
      try {
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
        historySaved = true;
        historyMessage = "Run saved to your history.";
      } catch (historyError) {
        console.error("Backtest completed, but history could not be saved:", historyError.message);
        historyMessage = "Run completed, but history could not be saved. Check the database connection.";
      }
    }

    return res.json({ ...result, historySaved, historyMessage });
  } catch (error) {
    const message = typeof error === "string" ? error : error.message || "The backtest could not be completed.";
    console.error("Strategy run failed:", message);
    return res.status(500).json({ success: false, message });
  }
};

module.exports = { uploadCSV, runStrategy };

