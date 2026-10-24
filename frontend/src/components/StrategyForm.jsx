import { useState } from "react";
import { Play, Upload } from "lucide-react";
import api from "../services/api";
import { useBacktest } from "../context/BacktestContext";
function StrategyForm() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [csvFile, setCsvFile] = useState(null);
  const [csvPath, setCsvPath] = useState("");
  const [uploading, setUploading] = useState(false);
  const [notice, setNotice] = useState("");
  const { setBacktest } = useBacktest();
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
  const uploadCSV = async () => {
  if (!csvFile) {
    setNotice("Choose a CSV file (.csv, up to 25 MB).");
    return;
  }

  try {
    setUploading(true);
    setNotice("");
    const formData = new FormData();
    formData.append("csv", csvFile);

    const response = await api.post("/strategy/upload", formData);

    setCsvPath(response.data.filepath);
    setNotice(`${csvFile.name} uploaded successfully.`);

  } catch (err) {
    console.error(err);
    setNotice(err.response?.data?.message || err.response?.data?.error || err.message || "CSV upload failed. Please try again.");
  } finally {
    setUploading(false);
  }
};
  const runStrategy = async () => {
    try {
        setLoading(true);

        if (!csvPath) {
    setNotice("Upload a CSV file before running the strategy.");
    setLoading(false);
    return;
  }

  const response = await api.post("/strategy/run", {
    ...strategy,
    csvPath,
  });

    setResult(response.data);
    setNotice(response.data.historyMessage || (response.data.historySaved ? "Backtest completed and saved to your history." : "Backtest completed. Sign in to save this run to your history."));

    setBacktest({ ...response.data, rr: strategy.rr });
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
      <p className="mb-7 text-sm text-slate-400">Choose your settings and upload candle data. Sign-in is optional; sign in only if you want to save the run to your history.</p>

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
  <span id="csv-help" className="text-xs text-slate-500">Select a CSV file with your candle data.</span>
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

            <div>
              <dt className="text-sm text-slate-400">Entry</dt>
              <dd>{result.entry}</dd>
            </div>

            <div>
              <dt className="text-sm text-slate-400">Stop Loss</dt>
              <dd className="text-rose-300">{result.stopLoss}</dd>
            </div>

            <div>
              <dt className="text-sm text-slate-400">Target</dt>
              <dd className="text-emerald-300">{result.target}</dd>
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
