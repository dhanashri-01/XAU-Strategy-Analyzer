import { useState } from "react";
import { Play, Upload } from "lucide-react";
import api from "../services/api";
import { useBacktest } from "../context/BacktestContext";
import { useAuth } from "../context/AuthContext";
const formatPrice = (value) => {
  if (value === null || value === undefined || value === "") return "-";
  const num = Number(value);
  if (Number.isNaN(num)) return String(value);
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

function StrategyForm() {
  const maxCsvSizeMb = Number(import.meta.env.VITE_MAX_CSV_SIZE_MB) || 100;
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [csvFile, setCsvFile] = useState(null);
  const [csvPath, setCsvPath] = useState("");
  const [uploading, setUploading] = useState(false);
  const [notice, setNotice] = useState("");
  const { setBacktest } = useBacktest();
  const { user } = useAuth();
  const [strategy, setStrategy] = useState({
    fastEMA: 50,
    slowEMA: 200,

    londonStart: "08:00",
    londonEnd: "11:00",

    newYorkStart: "13:00",
    newYorkEnd: "16:00",

    minCandles: 5,
    fibLevel: 0.5,
    slRatio: 0.702,
    rr: 2,

    trendFilter: true,
    confirmation: true,
    fib618: true,
    bullish: true,
    bearish: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setStrategy((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const performUpload = async (file) => {
    if (!file) {
      setNotice(`Choose a CSV file (.csv, up to ${maxCsvSizeMb} MB).`);
      return null;
    }

    if (file.size > maxCsvSizeMb * 1024 * 1024) {
      setNotice(`The CSV must be ${maxCsvSizeMb} MB or smaller.`);
      return null;
    }

    try {
      setUploading(true);
      setNotice("Uploading CSV file...");
      const formData = new FormData();
      formData.append("csv", file);

      const response = await api.post("/strategy/upload", formData);
      setCsvPath(response.data.filepath);
      setNotice(`${file.name} uploaded successfully.`);
      return response.data.filepath;
    } catch (err) {
      console.error(err);
      setNotice(err.response?.data?.message || err.response?.data?.error || err.message || "CSV upload failed. Please try again.");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const uploadCSV = async () => {
    await performUpload(csvFile);
  };

  const runStrategy = async () => {
    try {
      setLoading(true);
      setNotice("");

      let activeCsvPath = csvPath;
      if (!activeCsvPath) {
        if (!csvFile) {
          setNotice("Choose or upload a CSV file before running the strategy.");
          setLoading(false);
          return;
        }

        activeCsvPath = await performUpload(csvFile);
        if (!activeCsvPath) {
          setLoading(false);
          return;
        }
      }

      setNotice("Running backtest...");
      const response = await api.post("/strategy/run", {
        ...strategy,
        csvPath: activeCsvPath,
      });

      setResult(response.data);
      setNotice(response.data.historyMessage || (response.data.historySaved ? "Backtest completed and saved to your history." : "Backtest completed. Sign in to save this run to your history."));

      setBacktest({ ...response.data, rr: strategy.rr });

      try {
        const historyKey = user?.uid ? `xau_history_${user.uid}` : "xau_history_guest";
        const existing = JSON.parse(localStorage.getItem(historyKey) || "[]");
        const newRun = {
          _id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          signal: response.data.signal,
          entry: response.data.entry,
          stopLoss: response.data.stopLoss,
          target: response.data.target,
          accuracy: response.data.accuracy,
          wins: response.data.wins,
          losses: response.data.losses,
          trades: response.data.trades,
          netRR: response.data.netRR,
          fastEMA: strategy.fastEMA,
          slowEMA: strategy.slowEMA,
          rr: strategy.rr,
        };
        localStorage.setItem(historyKey, JSON.stringify([newRun, ...existing].slice(0, 50)));
      } catch (localSaveErr) {
        console.warn("Could not cache run in local history:", localSaveErr);
      }
    } catch (error) {
      console.error(error);
      setNotice(error.response?.data?.message || error.response?.data?.error || error.message || "The backtest could not be completed. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-900/70 p-4 shadow-xl shadow-black/10 sm:p-6 lg:p-8">

      <h2 className="mb-2 text-xl font-semibold text-white sm:text-2xl">
        Strategy Builder
      </h2>
      <p className="mb-7 text-sm text-slate-400">
        No account needed. Upload your candle data CSV, tune the parameters, and run a backtest instantly.
        {" "}<span className="text-slate-500">Sign in only to save runs to your history.</span>
      </p>

      {/* EMA */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">

        <div>
          <label htmlFor="fastEMA" className="mb-2 block text-sm text-slate-300">
            Fast EMA
          </label>

          <input
            type="number"
            id="fastEMA"
            name="fastEMA"
            value={strategy.fastEMA}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-700 bg-slate-950/70 p-3 text-white focus:border-emerald-400 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="slowEMA" className="mb-2 block text-sm text-slate-300">
            Slow EMA
          </label>

          <input
            type="number"
            id="slowEMA"
            name="slowEMA"
            value={strategy.slowEMA}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-700 bg-slate-950/70 p-3 text-white focus:border-emerald-400 focus:outline-none"
          />
        </div>

      </div>

      {/* Session */}

      <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">

        <div>
          <label htmlFor="londonStart" className="mb-2 block text-sm text-slate-300">
            London Start
          </label>

          <input
            type="time"
            id="londonStart"
            name="londonStart"
            value={strategy.londonStart}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-700 bg-slate-950/70 p-3 text-white focus:border-emerald-400 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="londonEnd" className="mb-2 block text-sm text-slate-300">
            London End
          </label>

          <input
            type="time"
            id="londonEnd"
            name="londonEnd"
            value={strategy.londonEnd}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-700 bg-slate-950/70 p-3 text-white focus:border-emerald-400 focus:outline-none"
          />
        </div>

      </div>

      {/* Strategy */}

      <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">

        <div>
          <label htmlFor="minCandles" className="mb-2 block text-sm text-slate-300">
            Min Candles
          </label>

          <input
            type="number"
            id="minCandles"
            name="minCandles"
            value={strategy.minCandles}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-700 bg-slate-950/70 p-3 text-white focus:border-emerald-400 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="fibLevel" className="mb-2 block text-sm text-slate-300">
            Fib Level
          </label>

          <input
            type="number"
            id="fibLevel"
            step="0.001"
            name="fibLevel"
            value={strategy.fibLevel}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-700 bg-slate-950/70 p-3 text-white focus:border-emerald-400 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="slRatio" className="mb-2 block text-sm text-slate-300">
            SL Ratio
          </label>

          <input
            type="number"
            id="slRatio"
            step="0.001"
            name="slRatio"
            value={strategy.slRatio}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-700 bg-slate-950/70 p-3 text-white focus:border-emerald-400 focus:outline-none"
          />
        </div>

      </div>

      {/* Filters */}

      <fieldset className="mt-7 grid grid-cols-1 gap-3 text-sm text-white sm:grid-cols-2">
        <legend className="mb-3 text-sm font-medium text-slate-300">Strategy filters</legend>

        <label className="flex min-h-12 items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/40 px-4">
          <input
            type="checkbox"
            className="size-4 accent-emerald-400"
            name="trendFilter"
            checked={strategy.trendFilter}
            onChange={handleChange}
          />
          <span>EMA filter</span>
        </label>

        <label className="flex min-h-12 items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/40 px-4">
          <input
            type="checkbox"
            className="size-4 accent-emerald-400"
            name="confirmation"
            checked={strategy.confirmation}
            onChange={handleChange}
          />
          <span>Confirmation candle</span>
        </label>

        <label className="flex min-h-12 items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/40 px-4">
          <input
            type="checkbox"
            className="size-4 accent-emerald-400"
            name="fib618"
            checked={strategy.fib618}
            onChange={handleChange}
          />
          <span>0.618 filter</span>
        </label>

        <label className="flex min-h-12 items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/40 px-4">
          <input
            type="checkbox"
            className="size-4 accent-emerald-400"
            name="bullish"
            checked={strategy.bullish}
            onChange={handleChange}
          />
          <span>Bullish blocks</span>
        </label>

        <label className="flex min-h-12 items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/40 px-4">
          <input
            type="checkbox"
            className="size-4 accent-emerald-400"
            name="bearish"
            checked={strategy.bearish}
            onChange={handleChange}
          />
          <span>Bearish blocks</span>
        </label>

      </fieldset>

      {/* Buttons */}

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end">

        <button
          onClick={runStrategy}
          disabled={loading}
          aria-busy={loading}
          className="flex min-h-12 items-center justify-center gap-2 rounded-lg bg-emerald-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 disabled:cursor-wait disabled:opacity-60 sm:w-auto"
        >
          <Play size={18} />
          Run Strategy
        </button>

        <div className="flex min-w-0 flex-col gap-2 sm:flex-1">

  <label htmlFor="csv-file" className="text-sm font-medium text-slate-300">Market data file</label>
  <input
    type="file"
    id="csv-file"
    accept=".csv"
    aria-describedby="csv-help csv-status"
    onChange={(e) => {
      setCsvFile(e.target.files[0] || null);
      setCsvPath("");
      setNotice("");
    }}
    className="w-full rounded-lg border border-slate-700 bg-slate-950/70 p-2 text-sm text-slate-300 file:mr-3 file:rounded-md file:border-0 file:bg-slate-800 file:px-3 file:py-2 file:text-slate-100"
  />
  <span id="csv-help" className="text-xs text-slate-500">Select a CSV file with your candle data (up to {maxCsvSizeMb} MB).</span>
  <span id="csv-status" role="status" aria-live="polite" className={notice ? "text-sm text-amber-200" : "sr-only"}>{notice}</span>

  <button
    onClick={uploadCSV}
    disabled={uploading}
    aria-busy={uploading}
    className="flex min-h-12 items-center justify-center gap-2 rounded-lg border border-slate-600 bg-slate-800 px-5 py-3 font-medium text-white transition hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 disabled:opacity-60"
  >
    <Upload size={18} />
    {uploading ? "Uploading..." : "Upload CSV"}
  </button>

</div>
{csvPath && (
  <p role="status" className="mt-2 text-sm text-emerald-300">
    CSV ready to run
  </p>
)}
      </div>

      {/* Loading */}

      {loading && (
        <div className="mt-6 text-sky-300" role="status" aria-live="polite">
          Running Strategy...
        </div>
      )}

      {/* Result */}

      {result && (
        <section aria-labelledby="result-heading" className="mt-8 rounded-xl border border-slate-700 bg-slate-800/70 p-4 sm:p-6">

          <h3 id="result-heading" className="mb-6 text-xl font-semibold text-white sm:text-2xl">
            Strategy Result
          </h3>

          <dl className="grid grid-cols-2 gap-4 text-white sm:gap-6">

            <div>
              <dt className="text-sm text-slate-400">Signal</dt>
              <dd className="text-lg font-semibold text-emerald-300">{result.signal}</dd>
            </div>

            <div className="min-w-0">
              <dt className="text-sm text-slate-400">Entry</dt>
              <dd className="truncate font-semibold text-white">{formatPrice(result.entry)}</dd>
            </div>

            <div className="min-w-0">
              <dt className="text-sm text-slate-400">Stop Loss</dt>
              <dd className="truncate font-semibold text-rose-300">{formatPrice(result.stopLoss)}</dd>
            </div>

            <div className="min-w-0">
              <dt className="text-sm text-slate-400">Target</dt>
              <dd className="truncate font-semibold text-emerald-300">{formatPrice(result.target)}</dd>
            </div>

            <div>
              <dt className="text-sm text-slate-400">Accuracy</dt>
              <dd>{result.accuracy}%</dd>
            </div>

            <div>
              <dt className="text-sm text-slate-400">Trades</dt>
              <dd>{result.trades}</dd>
            </div>

            <div>
              <dt className="text-sm text-slate-400">Wins</dt>
              <dd className="text-emerald-300">{result.wins}</dd>
            </div>

            <div>
              <dt className="text-sm text-slate-400">Losses</dt>
              <dd className="text-rose-300">{result.losses}</dd>
            </div>

          </dl>

        </section>
      )}

    </div>
  );
}

export default StrategyForm;
