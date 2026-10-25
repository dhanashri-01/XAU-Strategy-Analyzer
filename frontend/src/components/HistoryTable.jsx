import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function HistoryTable() {
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");
  const { user, loading } = useAuth();

  useEffect(() => {
    let active = true;
    const historyKey = user ? `xau_history_${user.uid}` : "xau_history_guest";
    const cached = JSON.parse(localStorage.getItem(historyKey) || "[]");
    if (cached.length > 0) {
      setHistory(cached);
    }

    if (!user) {
      return undefined;
    }

    api.get("/history")
      .then((response) => {
        if (!active) return;
        const data = Array.isArray(response.data) ? response.data : [];
        setHistory(data);
        setError("");
        if (data.length > 0) {
          localStorage.setItem(`xau_history_${user.uid}`, JSON.stringify(data));
        }
      })
      .catch((err) => {
        if (!active) return;
        console.error(err);
        const local = JSON.parse(localStorage.getItem(`xau_history_${user.uid}`) || "[]");
        if (local.length > 0) {
          setHistory(local);
          const serverMsg = err.response?.data?.message || err.message;
          setError(`Showing local history. Database note: ${serverMsg}`);
        } else {
          setError(err.response?.data?.message || err.response?.data?.error || err.message || "Could not load strategy history.");
        }
      });

    return () => { active = false; };
  }, [user]);

  return (
    <section aria-label="Your strategy run history" className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
      {loading ? (
        <p className="p-6 text-slate-300">Loading account...</p>
      ) : !user && history.length === 0 ? (
        <p className="p-6 text-slate-300">Sign in to view your strategy testing history.</p>
      ) : (
        <>
          {!user && (
            <p className="border-b border-slate-800 bg-amber-500/10 px-6 py-3 text-sm text-amber-300">
              Showing session runs. Sign in to permanently save your history to MongoDB.
            </p>
          )}
          {error && (
            <p className="border-b border-slate-800 bg-rose-500/10 px-6 py-3 text-sm text-rose-300">
              {error}
            </p>
          )}
          {history.length === 0 ? (
            <p className="p-6 text-slate-300">No strategy runs saved yet. Run a strategy in Strategy Builder to build your history.</p>
          ) : (
            <div className="overflow-x-auto" role="region" aria-label="Strategy history table" tabIndex={0}>
              <table className="w-full min-w-[760px] text-left">
                <caption className="sr-only">Saved strategy testing runs, newest first</caption>
                <thead className="bg-slate-800">
                  <tr className="text-slate-300">
                    <th scope="col" className="p-4">Date</th>
                    <th scope="col" className="p-4">Signal</th>
                    <th scope="col" className="p-4">EMA</th>
                    <th scope="col" className="p-4">Trades</th>
                    <th scope="col" className="p-4">Wins</th>
                    <th scope="col" className="p-4">Losses</th>
                    <th scope="col" className="p-4">Accuracy</th>
                    <th scope="col" className="p-4">Net RR</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item, index) => (
                    <tr
                      key={item._id || index}
                      className="border-t border-slate-800 hover:bg-slate-800/60"
                    >
                      <td className="p-4 text-white">
                        {item.createdAt ? new Date(item.createdAt).toLocaleString() : "Just now"}
                      </td>
                      <td className={`p-4 font-semibold ${
                        item.signal === "BUY" || item.signal === "BULLISH"
                          ? "text-green-400"
                          : "text-red-400"
                      }`}>
                        {item.signal}
                      </td>
                      <td className="p-4 text-blue-400">
                        {item.fastEMA ?? "-"}
                      </td>
                      <td className="p-4 text-white">
                        {item.trades ?? "-"}
                      </td>
                      <td className="p-4 text-green-400">
                        {item.wins ?? "-"}
                      </td>
                      <td className="p-4 text-red-400">
                        {item.losses ?? "-"}
                      </td>
                      <td className="p-4 text-green-400">
                        {item.accuracy != null ? `${item.accuracy}%` : "-"}
                      </td>
                      <td className="p-4 text-yellow-400">
                        {item.netRR ?? "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default HistoryTable;
