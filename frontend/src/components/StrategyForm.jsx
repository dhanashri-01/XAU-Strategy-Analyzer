import { useState } from "react";
import { Play, Upload } from "lucide-react";
import api from "../services/api";
import { useBacktest } from "../context/BacktestContext";
function StrategyForm() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [csvFile, setCsvFile] = useState(null);
  const [csvPath, setCsvPath] = useState("");
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
    alert("Please select a CSV file.");
    return;
  }

  try {
    const formData = new FormData();
    formData.append("csv", csvFile);

    const response = await api.post("/strategy/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    setCsvPath(response.data.filepath);

    alert("CSV Uploaded Successfully!");

  } catch (err) {
    console.error(err);
    alert("CSV Upload Failed");
  }
};
  const runStrategy = async () => {
    try {
        setLoading(true);

        if (!csvPath) {
    alert("Please upload the CSV first.");
    setLoading(false);
    return;
  }

  const response = await api.post("/strategy/run", {
    ...strategy,
    csvPath,
  });

    setResult(response.data);

    setBacktest(response.data);
    } catch (error) {
      console.error(error);
      alert("Backend Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8">

      <h2 className="text-2xl text-white font-semibold mb-8">
        Strategy Builder
      </h2>

      {/* EMA */}

      <div className="grid grid-cols-2 gap-6">

        <div>
          <label className="block text-slate-300 mb-2">
            Fast EMA
          </label>

          <input
            type="number"
            name="fastEMA"
            value={strategy.fastEMA}
            onChange={handleChange}
            className="w-full bg-slate-800 text-white rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block text-slate-300 mb-2">
            Slow EMA
          </label>

          <input
            type="number"
            name="slowEMA"
            value={strategy.slowEMA}
            onChange={handleChange}
            className="w-full bg-slate-800 text-white rounded-lg p-3"
          />
        </div>

      </div>

      {/* Session */}

      <div className="grid grid-cols-2 gap-6 mt-8">

        <div>
          <label className="block text-slate-300 mb-2">
            London Start
          </label>

          <input
            type="time"
            name="londonStart"
            value={strategy.londonStart}
            onChange={handleChange}
            className="w-full bg-slate-800 text-white rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block text-slate-300 mb-2">
            London End
          </label>

          <input
            type="time"
            name="londonEnd"
            value={strategy.londonEnd}
            onChange={handleChange}
            className="w-full bg-slate-800 text-white rounded-lg p-3"
          />
        </div>

      </div>

      {/* Strategy */}

      <div className="grid grid-cols-3 gap-6 mt-8">

        <div>
          <label className="block text-slate-300 mb-2">
            Min Candles
          </label>

          <input
            type="number"
            name="minCandles"
            value={strategy.minCandles}
            onChange={handleChange}
            className="w-full bg-slate-800 text-white rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block text-slate-300 mb-2">
            Fib Level
          </label>

          <input
            type="number"
            step="0.001"
            name="fibLevel"
            value={strategy.fibLevel}
            onChange={handleChange}
            className="w-full bg-slate-800 text-white rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block text-slate-300 mb-2">
            SL Ratio
          </label>

          <input
            type="number"
            step="0.001"
            name="slRatio"
            value={strategy.slRatio}
            onChange={handleChange}
            className="w-full bg-slate-800 text-white rounded-lg p-3"
          />
        </div>

      </div>

      {/* Filters */}

      <div className="grid grid-cols-2 gap-4 mt-8 text-white">

        <label>
          <input
            type="checkbox"
            name="trendFilter"
            checked={strategy.trendFilter}
            onChange={handleChange}
          />
          <span className="ml-2">EMA Filter</span>
        </label>

        <label>
          <input
            type="checkbox"
            name="confirmation"
            checked={strategy.confirmation}
            onChange={handleChange}
          />
          <span className="ml-2">Confirmation Candle</span>
        </label>

        <label>
          <input
            type="checkbox"
            name="fib618"
            checked={strategy.fib618}
            onChange={handleChange}
          />
          <span className="ml-2">0.618 Filter</span>
        </label>

        <label>
          <input
            type="checkbox"
            name="bullish"
            checked={strategy.bullish}
            onChange={handleChange}
          />
          <span className="ml-2">Bullish Blocks</span>
        </label>

      </div>

      {/* Buttons */}

      <div className="flex gap-4 mt-10">

        <button
          onClick={runStrategy}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg text-white"
        >
          <Play size={18} />
          Run Strategy
        </button>

        <div className="flex flex-col gap-3">

  <input
    type="file"
    accept=".csv"
    onChange={(e) => setCsvFile(e.target.files[0])}
    className="text-white"
  />

  <button
    onClick={uploadCSV}
    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg text-white"
  >
    <Upload size={18} />
    Upload CSV
  </button>

</div>
{csvPath && (
  <p className="text-green-400 mt-2">
    CSV Uploaded Successfully
  </p>
)}
      </div>

      {/* Loading */}

      {loading && (
        <div className="mt-6 text-blue-400">
          Running Strategy...
        </div>
      )}

      {/* Result */}

      {result && (
        <div className="mt-8 bg-slate-800 rounded-xl p-6">

          <h2 className="text-2xl font-bold text-white mb-6">
            Strategy Result
          </h2>

          <div className="grid grid-cols-2 gap-6 text-white">

            <div>
              <p className="text-slate-400">Signal</p>
              <h3 className="text-green-400 text-xl">{result.signal}</h3>
            </div>

            <div>
              <p className="text-slate-400">Entry</p>
              <h3>{result.entry}</h3>
            </div>

            <div>
              <p className="text-slate-400">Stop Loss</p>
              <h3 className="text-red-400">{result.stopLoss}</h3>
            </div>

            <div>
              <p className="text-slate-400">Target</p>
              <h3 className="text-green-400">{result.target}</h3>
            </div>

            <div>
              <p className="text-slate-400">Accuracy</p>
              <h3>{result.accuracy}%</h3>
            </div>

            <div>
              <p className="text-slate-400">Trades</p>
              <h3>{result.trades}</h3>
            </div>

            <div>
              <p className="text-slate-400">Wins</p>
              <h3 className="text-green-400">{result.wins}</h3>
            </div>

            <div>
              <p className="text-slate-400">Losses</p>
              <h3 className="text-red-400">{result.losses}</h3>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default StrategyForm;