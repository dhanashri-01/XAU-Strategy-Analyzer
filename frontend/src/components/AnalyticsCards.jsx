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
      <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900 p-8 text-center text-slate-400 sm:p-10" role="status">
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
    <section aria-label="Backtest performance metrics" className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5 xl:gap-5">
      {stats.map((item, index) => (
        <div
          key={index}
          className="metric-card rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-5"
        >
          <div className="flex justify-between items-center">

            <div>

              <p className="text-slate-400 text-sm">
                {item.title}
              </p>

              <p className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
                {item.value}
              </p>

            </div>

            <div className={`flex size-11 items-center justify-center rounded-xl bg-slate-800 text-2xl ${item.color}`}>
              <span aria-hidden="true">{item.icon}</span>
            </div>

          </div>
        </div>
      ))}
    </section>
  );
}

export default AnalyticsCards;
