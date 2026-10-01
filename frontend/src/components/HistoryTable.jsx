import { useEffect, useState } from "react";
import api from "../services/api";

function HistoryTable() {

  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {

      const res = await api.get("/history");

      setHistory(res.data);

    } catch (err) {

      console.error(err);

    }
  };

  return (

    <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">

      <table className="w-full">

        <thead className="bg-slate-800">

          <tr className="text-slate-300">

            <th className="p-4">Date</th>
            <th className="p-4">Signal</th>
            <th className="p-4">EMA</th>
            <th className="p-4">Trades</th>
            <th className="p-4">Wins</th>
            <th className="p-4">Losses</th>
            <th className="p-4">Accuracy</th>
            <th className="p-4">Net RR</th>

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

  );

}

export default HistoryTable;