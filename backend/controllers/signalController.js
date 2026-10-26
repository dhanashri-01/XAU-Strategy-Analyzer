const fs = require("fs");
const path = require("path");

// In-memory live state
let liveState = {
  symbol: "XAUUSD",
  price: 4617.50,
  signal: "BEARISH",
  entry: 4617.35,
  stopLoss: 4621.50,
  target: 4609.05,
  rr: 2.0,
  fastEMA: 4618.20,
  slowEMA: 4624.10,
  change24h: -0.42,
  pnlPips: 2.5,
  progress: 15.2,
  status: "ACTIVE",
  timeframe: "5M",
  lastUpdated: new Date().toISOString(),
};

// Try to seed initial price from latest uploaded CSV if available
const uploadsDir = path.resolve(__dirname, "../uploads");
try {
  if (fs.existsSync(uploadsDir)) {
    const files = fs.readdirSync(uploadsDir).filter((f) => f.endsWith(".csv"));
    if (files.length > 0) {
      const stats = files.map((f) => ({
        file: f,
        time: fs.statSync(path.join(uploadsDir, f)).mtimeMs,
      })).sort((a, b) => b.time - a.time);

      const latestFile = path.join(uploadsDir, stats[0].file);
      const buffer = fs.readFileSync(latestFile, { encoding: "utf8" });
      const lines = buffer.trim().split("\n");
      if (lines.length > 1) {
        const lastLine = lines[lines.length - 1].split(",");
        // Typically Open,High,Low,Close or Time,Open,High,Low,Close
        const possibleClose = parseFloat(lastLine[4] || lastLine[3]);
        if (!isNaN(possibleClose) && possibleClose > 500) {
          liveState.price = Math.round(possibleClose * 100) / 100;
          liveState.entry = liveState.price;
          liveState.stopLoss = Math.round((liveState.price + 4.15) * 100) / 100;
          liveState.target = Math.round((liveState.price - 8.30) * 100) / 100;
        }
      }
    }
  }
} catch (e) {
  // Use default baseline
}

// Function to generate dynamic tick / update
function updateDynamicSignal() {
  const delta = (Math.random() - 0.49) * 0.45;
  const newPrice = Math.round((liveState.price + delta) * 100) / 100;
  liveState.price = newPrice;
  liveState.lastUpdated = new Date().toISOString();

  // Update EMA smoothers
  liveState.fastEMA = Math.round((liveState.fastEMA * 0.95 + newPrice * 0.05) * 100) / 100;
  liveState.slowEMA = Math.round((liveState.slowEMA * 0.99 + newPrice * 0.01) * 100) / 100;

  // Determine trend & signal
  const isBull = liveState.price >= liveState.fastEMA && liveState.fastEMA >= liveState.slowEMA;
  const isBear = liveState.price <= liveState.fastEMA && liveState.fastEMA <= liveState.slowEMA;
  
  if (isBull) {
    liveState.signal = "BULLISH";
    // Check if new trade setup should be formed
    if (liveState.price >= liveState.target || liveState.price <= liveState.stopLoss) {
      liveState.entry = liveState.price;
      const slDist = 3.50;
      liveState.stopLoss = Math.round((liveState.price - slDist) * 100) / 100;
      liveState.target = Math.round((liveState.price + slDist * liveState.rr) * 100) / 100;
    }
  } else if (isBear) {
    liveState.signal = "BEARISH";
    if (liveState.price <= liveState.target || liveState.price >= liveState.stopLoss) {
      liveState.entry = liveState.price;
      const slDist = 3.50;
      liveState.stopLoss = Math.round((liveState.price + slDist) * 100) / 100;
      liveState.target = Math.round((liveState.price - slDist * liveState.rr) * 100) / 100;
    }
  }

  // Calculate real-time progress & PnL
  if (liveState.signal === "BULLISH") {
    const totalDist = Math.max(0.1, liveState.target - liveState.entry);
    const currDist = liveState.price - liveState.entry;
    liveState.pnlPips = Math.round(currDist * 10) / 10;
    liveState.progress = Math.min(100, Math.max(0, Math.round((currDist / totalDist) * 100)));
  } else {
    const totalDist = Math.max(0.1, liveState.entry - liveState.target);
    const currDist = liveState.entry - liveState.price;
    liveState.pnlPips = Math.round(currDist * 10) / 10;
    liveState.progress = Math.min(100, Math.max(0, Math.round((currDist / totalDist) * 100)));
  }

  return liveState;
}

// Tick periodically in memory
setInterval(updateDynamicSignal, 2000);

const getLiveSignal = async (req, res) => {
  const signal = updateDynamicSignal();
  return res.json({
    success: true,
    ...signal,
  });
};

const streamLiveSignals = (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();

  // Send initial data immediately
  res.write(`data: ${JSON.stringify(liveState)}\n\n`);

  const intervalId = setInterval(() => {
    const data = updateDynamicSignal();
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  }, 2000);

  req.on("close", () => {
    clearInterval(intervalId);
    res.end();
  });
};

const updateLiveSettings = (req, res) => {
  const { fastEMA, slowEMA, rr, slRatio } = req.body || {};
  if (rr) liveState.rr = Number(rr);
  return res.json({ success: true, ...liveState });
};

module.exports = {
  getLiveSignal,
  streamLiveSignals,
  updateLiveSettings,
};

