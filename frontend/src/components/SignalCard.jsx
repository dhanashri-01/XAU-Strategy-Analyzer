import { useState, useEffect, useRef } from "react";
import { ArrowDownRight, ArrowUpRight, Activity, Radio, RefreshCw } from "lucide-react";
import { useBacktest } from "../context/BacktestContext";
import api from "../services/api";

const formatPrice = (value) => {
  if (value === null || value === undefined || value === "") return "-";
  const num = Number(value);
  if (Number.isNaN(num)) return String(value);
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

function SignalCard() {
  const { backtest } = useBacktest();

  // Mode: "live" | "backtest"
  const [mode, setMode] = useState("live");
  const [priceFlash, setPriceFlash] = useState(null);
  const [lastUpdatedText, setLastUpdatedText] = useState("Connecting...");
  const lastPriceRef = useRef(null);

  // Live signal state
  const [liveSignal, setLiveSignal] = useState({
    symbol: "XAUUSD",
    price: 4617.50,
    signal: "BEARISH",
    entry: 4617.35,
    stopLoss: 4621.50,
    target: 4609.05,
    rr: 2.0,
    pnlPips: 2.5,
    progress: 25,
    timeframe: "5M",
    lastUpdated: new Date().toISOString(),
  });

  // Switch to backtest mode automatically when a fresh backtest completes
  useEffect(() => {
    if (backtest?.signal) {
      setMode("backtest");
    }
  }, [backtest]);

  // Handle incoming live data update
  const handleLiveTick = (data) => {
    if (!data || !data.price) return;
    const newPrice = Number(data.price);
    if (lastPriceRef.current !== null && newPrice !== lastPriceRef.current) {
      setPriceFlash(newPrice > lastPriceRef.current ? "up" : "down");
      setTimeout(() => setPriceFlash(null), 800);
    }
    lastPriceRef.current = newPrice;

    setLiveSignal((prev) => ({
      ...prev,
      ...data,
      price: newPrice,
      lastUpdated: new Date().toISOString(),
    }));
    setLastUpdatedText("Live");
  };

  // Real-time connection: SSE + polling fallback + Binance live gold WebSocket
  useEffect(() => {
    let sse = null;
    let pollInterval = null;
    let ws = null;

    // 1. Initial REST fetch
    api.get("/signals/live")
      .then((res) => {
        if (res.data?.success) {
          handleLiveTick(res.data);
        }
      })
      .catch((err) => {
        console.warn("Initial live signal fetch note:", err.message);
      });

    // 2. Server-Sent Events (SSE) Stream from backend
    try {
      const baseURL = api.defaults.baseURL || "http://localhost:5000/api";
      const streamUrl = `${baseURL}/signals/stream`;
      sse = new EventSource(streamUrl);

      sse.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          handleLiveTick(parsed);
        } catch (e) {
          // ignore
        }
      };

      sse.onerror = () => {
        // SSE disconnected, fallback to polling
        if (!pollInterval) {
          pollInterval = setInterval(() => {
            api.get("/signals/live")
              .then((res) => {
                if (res.data?.success) handleLiveTick(res.data);
              })
              .catch(() => {});
          }, 2500);
        }
      };
    } catch (e) {
      // Fallback polling
      pollInterval = setInterval(() => {
        api.get("/signals/live")
          .then((res) => {
            if (res.data?.success) handleLiveTick(res.data);
          })
          .catch(() => {});
      }, 2500);
    }

    // 3. Connect to Binance PAXGUSDT (Gold Token 1:1) WebSocket in browser for live ticks
    try {
      ws = new WebSocket("wss://stream.binance.com:9443/ws/paxgusdt@ticker");
      ws.onmessage = (event) => {
        try {
          const tick = JSON.parse(event.data);
          if (tick.c) {
            const liveGoldPrice = parseFloat(tick.c);
            setLiveSignal((prev) => {
              if (lastPriceRef.current !== null && liveGoldPrice !== lastPriceRef.current) {
                setPriceFlash(liveGoldPrice > lastPriceRef.current ? "up" : "down");
                setTimeout(() => setPriceFlash(null), 800);
              }
              lastPriceRef.current = liveGoldPrice;

              // Dynamically update target / SL distances
              const isBull = prev.signal === "BULLISH" || prev.signal === "BUY";
              const entry = prev.entry || liveGoldPrice;
              const slDist = 3.50;
              const stopLoss = isBull ? entry - slDist : entry + slDist;
              const target = isBull ? entry + slDist * (prev.rr || 2) : entry - slDist * (prev.rr || 2);
              const totalDist = Math.max(0.1, Math.abs(target - entry));
              const currDist = isBull ? liveGoldPrice - entry : entry - liveGoldPrice;
              const progress = Math.min(100, Math.max(0, Math.round((currDist / totalDist) * 100)));

              return {
                ...prev,
                price: liveGoldPrice,
                entry,
                stopLoss: Math.round(stopLoss * 100) / 100,
                target: Math.round(target * 100) / 100,
                progress,
                pnlPips: Math.round(currDist * 10) / 10,
                lastUpdated: new Date().toISOString(),
              };
            });
            setLastUpdatedText("Live WebSocket");
          }
        } catch (err) {
          // fallback stays active
        }
      };
    } catch (e) {
      // ignore
    }

    // Relative time updater
    const timer = setInterval(() => {
      setLastUpdatedText("Live");
    }, 5000);

    return () => {
      if (sse) sse.close();
      if (pollInterval) clearInterval(pollInterval);
      if (ws) ws.close();
      clearInterval(timer);
    };
  }, []);

  // Determine active display data
  const isBacktestMode = mode === "backtest" && backtest;
  const displayData = isBacktestMode
    ? {
        signal: backtest.signal || "NO SIGNAL",
        entry: backtest.entry,
        stopLoss: backtest.stopLoss,
        target: backtest.target,
        rr: backtest.rr ?? 2,
        price: backtest.entry,
        pnlPips: null,
        progress: null,
        timeframe: "Backtest",
      }
    : liveSignal;

  const isBuy =
    displayData.signal === "BUY" ||
    displayData.signal === "BULLISH";

  return (
    <section
      aria-labelledby="signal-heading"
      className="metric-card relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 p-5 shadow-xl sm:p-6"
    >
      {/* Background glow */}
      <div
        className={`pointer-events-none absolute -right-12 -top-12 size-48 rounded-full blur-3xl ${
          isBuy ? "bg-emerald-500/10" : "bg-rose-500/10"
        }`}
      />

      {/* Header */}
      <div>
        <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <h2 id="signal-heading" className="text-base font-semibold text-white sm:text-lg">
              Current Signal
            </h2>
            {!isBacktestMode && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold tracking-wide text-emerald-400">
                <span className="size-1.5 animate-pulse rounded-full bg-emerald-400" />
                LIVE
              </span>
            )}
          </div>

          {/* Mode Switcher */}
          <div className="flex rounded-lg border border-slate-700/80 bg-slate-950 p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setMode("live")}
              className={`flex items-center gap-1 rounded-md px-2.5 py-1 font-medium transition ${
                mode === "live"
                  ? "bg-emerald-500 text-slate-950 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Radio size={12} className={mode === "live" ? "animate-pulse" : ""} />
              Live
            </button>
            <button
              type="button"
              onClick={() => setMode("backtest")}
              disabled={!backtest}
              title={!backtest ? "Run a backtest first to view backtest signal" : ""}
              className={`rounded-md px-2.5 py-1 font-medium transition ${
                mode === "backtest"
                  ? "bg-slate-700 text-white shadow-sm"
                  : backtest
                  ? "text-slate-400 hover:text-white"
                  : "cursor-not-allowed opacity-40 text-slate-500"
              }`}
            >
              Backtest
            </button>
          </div>
        </div>

        {/* Live Market Price & Direction Banner */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          {/* Signal Badge */}
          <div
            className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-bold tracking-wide shadow-sm ${
              isBuy
                ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                : "border border-rose-500/30 bg-rose-500/10 text-rose-300"
            }`}
          >
            {isBuy ? (
              <ArrowUpRight size={18} className="stroke-[2.5]" aria-hidden="true" />
            ) : (
              <ArrowDownRight size={18} className="stroke-[2.5]" aria-hidden="true" />
            )}
            <span>{displayData.signal || "SCANNING"}</span>
          </div>

          {/* Current Live Ticker */}
          <div className="flex flex-col items-end">
            <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
              {isBacktestMode ? "Setup Price" : "XAUUSD Market"}
            </span>
            <span
              className={`text-lg font-bold tabular-nums transition-colors duration-300 sm:text-xl ${
                priceFlash === "up"
                  ? "text-emerald-400"
                  : priceFlash === "down"
                  ? "text-rose-400"
                  : "text-white"
              }`}
            >
              ${formatPrice(displayData.price)}
            </span>
          </div>
        </div>

        {/* Clean, Non-overlapping Metric Cards (4 Dedicated Compartments) */}
        <div className="mt-5 grid grid-cols-2 gap-2.5 sm:gap-3">
          {/* Entry */}
          <div className="min-w-0 rounded-xl border border-slate-800 bg-slate-950/70 p-3 sm:p-3.5 shadow-inner">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
              Entry
            </span>
            <p className="mt-1 truncate text-base font-bold tabular-nums text-white sm:text-lg">
              {formatPrice(displayData.entry)}
            </p>
          </div>

          {/* Stop Loss */}
          <div className="min-w-0 rounded-xl border border-rose-900/30 bg-rose-950/15 p-3 sm:p-3.5 shadow-inner">
            <span className="text-xs font-medium uppercase tracking-wider text-rose-300">
              Stop Loss
            </span>
            <p className="mt-1 truncate text-base font-bold tabular-nums text-rose-400 sm:text-lg">
              {formatPrice(displayData.stopLoss)}
            </p>
          </div>

          {/* Target */}
          <div className="min-w-0 rounded-xl border border-emerald-900/30 bg-emerald-950/15 p-3 sm:p-3.5 shadow-inner">
            <span className="text-xs font-medium uppercase tracking-wider text-emerald-300">
              Target
            </span>
            <p className="mt-1 truncate text-base font-bold tabular-nums text-emerald-400 sm:text-lg">
              {formatPrice(displayData.target)}
            </p>
          </div>

          {/* Risk Reward */}
          <div className="min-w-0 rounded-xl border border-sky-900/30 bg-sky-950/15 p-3 sm:p-3.5 shadow-inner">
            <span className="text-xs font-medium uppercase tracking-wider text-sky-300">
              Risk Reward
            </span>
            <p className="mt-1 truncate text-base font-bold tabular-nums text-sky-400 sm:text-lg">
              1 : {displayData.rr ?? "2.0"}
            </p>
          </div>
        </div>

        {/* Real-time Progress Bar (Live Mode Only) */}
        {!isBacktestMode && displayData.progress !== null && (
          <div className="mt-4 rounded-xl border border-slate-800/80 bg-slate-950/50 p-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Target Progress</span>
              <span className={`font-semibold tabular-nums ${displayData.pnlPips >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                {displayData.pnlPips >= 0 ? `+${displayData.pnlPips}` : displayData.pnlPips} pips
              </span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  isBuy ? "bg-emerald-400" : "bg-rose-400"
                }`}
                style={{ width: `${Math.min(100, Math.max(5, displayData.progress))}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-4 flex items-center justify-between border-t border-slate-800/60 pt-3 text-[11px] text-slate-500">
        <span className="inline-flex items-center gap-1">
          <Activity size={13} className="text-slate-400" />
          5M Timeframe
        </span>
        <span className="inline-flex items-center gap-1 tabular-nums">
          <RefreshCw size={11} className={!isBacktestMode ? "animate-spin" : ""} style={{ animationDuration: "6s" }} />
          {isBacktestMode ? "From Backtest Run" : lastUpdatedText}
        </span>
      </div>
    </section>
  );
}

export default SignalCard;
