import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function HistoryTable() {

  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!user) return undefined;

    let active = true;
    api.get("/history")
      .then((response) => {
        if (!active) return;
        setHistory(response.data);
        setError("");
      })
      .catch((err) => {
        if (!active) return;
        console.error(err);
        setError("Could not load your strategy history. Please try again.");
      });

    return () => { active = false; };
  }, [user]);

  return (

    <section aria-label="Your strategy run history" className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">

      {loading ? (
        <p className="p-6 text-slate-300">Loading account...</p>
      ) : !user ? (
        <p className="p-6 text-slate-300">Sign in to view your strategy testing history.</p>
      ) : error ? (
        <p className="p-6 text-red-400">{error}</p>
      ) : history.length === 0 ? (
        <p className="p-6 text-slate-300">No strategy runs saved yet. Run a strategy to build your history.</p>
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

          {history.map((item) => (

            <tr
              key={item._id}
              className="border-t border-slate-800 hover:bg-slate-800"
            >

              <td className="p-4 text-white">
                {new Date(item.createdAt).toLocaleString()}
              </td>

              <td className={`p-4 font-semibold ${
                item.signal === "BUY"
                  ? "text-green-400"
                  : "text-red-400"
              }`}>
                {item.signal}
              </td>

              <td className="p-4 text-blue-400">
                {item.fastEMA}
              </td>

              <td className="p-4 text-white">
                {item.trades}
              </td>

              <td className="p-4 text-green-400">
                {item.wins}
              </td>

              <td className="p-4 text-red-400">
                {item.losses}
              </td>

              <td className="p-4 text-green-400">
                {item.accuracy}%
              </td>

              <td className="p-4 text-yellow-400">
                {item.netRR}
              </td>

            </tr>

          ))}

        </tbody>

      </table>
      </div>

      )}

    </section>

  );

}

export default HistoryTable;
