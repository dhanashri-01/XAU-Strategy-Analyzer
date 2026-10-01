import {
  FaBullseye,
  FaChartLine,
  FaTrophy,
  FaTimesCircle,
  FaCoins,
} from "react-icons/fa";

import { useBacktest } from "../context/BacktestContext";

function AnalyticsCards() {

  const { backtest } = useBacktest();

  if (!backtest) {
    return (
      <div className="bg-slate-900 rounded-xl p-10 text-center text-slate-400">
        Run a strategy first to view analytics.
      </div>
    );
  }

  const stats = [
    {
      title: "Accuracy",
      value: `${backtest.accuracy}%`,
      icon: <FaBullseye />,
      color: "text-green-400",
    },
    {
      title: "Trades",
      value: backtest.trades,
      icon: <FaChartLine />,
      color: "text-blue-400",
    },
    {
      title: "Wins",
      value: backtest.wins,
      icon: <FaTrophy />,
      color: "text-green-500",
    },
    {
      title: "Losses",
      value: backtest.losses,
      icon: <FaTimesCircle />,
      color: "text-red-400",
    },
    {
      title: "Net RR",
      value: backtest.netRR,
      icon: <FaCoins />,
      color: "text-yellow-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
      {stats.map((item, index) => (
        <div
          key={index}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
        >
          <div className="flex justify-between items-center">

            <div>

              <p className="text-slate-400 text-sm">
                {item.title}
              </p>

              <h2 className="text-3xl font-bold text-white mt-2">
                {item.value}
              </h2>

            </div>

            <div className={`text-4xl ${item.color}`}>
              {item.icon}
            </div>

          </div>
        </div>
      ))}
    </div>
  );
}

export default AnalyticsCards;