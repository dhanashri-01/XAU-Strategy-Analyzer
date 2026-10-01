import MainLayout from "../layouts/MainLayout";

import StatCard from "../components/StatCard";
import ChartCard from "../components/ChartCard";
import SignalCard from "../components/SignalCard";
import StrategyPanel from "../components/StrategyForm";
import TradingChart from "../components/TradingChart";
import { stats } from "../data/dashboardData";

function Dashboard() {
  return (
    <MainLayout>

      {/* Header */}

      <div className="mb-8">

        <h1 className="text-4xl font-bold text-white">
          XAU Strategy Analyzer
        </h1>

        <p className="text-slate-400 mt-2">
          Analyze ICT Order Blocks, Fibonacci Entries and Strategy Performance
        </p>

      </div>

      {/* Statistics */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        {stats.map((card, index) => (

          <StatCard
            key={index}
            title={card.title}
            value={card.value}
            icon={card.icon}
            color={card.color}
            change={card.change}
          />

        ))}

      </div>

      {/* Chart + Signal */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">

        <div className="xl:col-span-2">

          <ChartCard />

        </div>

        <SignalCard />

      </div>

      {/* Strategy + Summary */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">

        <div className="xl:col-span-2">

          <StrategyPanel />

        </div>

        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">

          <h2 className="text-white text-xl font-semibold mb-6">

            Backtest Summary

          </h2>

          <div className="space-y-5">

            <div className="flex justify-between">

              <span className="text-slate-400">

                Total Trades

              </span>

              <span className="text-white font-semibold">

                245

              </span>

            </div>

            <div className="flex justify-between">

              <span className="text-slate-400">

                Wins

              </span>

              <span className="text-green-400 font-semibold">

                164

              </span>

            </div>

            <div className="flex justify-between">

              <span className="text-slate-400">

                Losses

              </span>

              <span className="text-red-400 font-semibold">

                81

              </span>

            </div>

            <div className="flex justify-between">

              <span className="text-slate-400">

                Win Rate

              </span>

              <span className="text-green-400 font-semibold">

                68.42%

              </span>

            </div>

            <div className="flex justify-between">

              <span className="text-slate-400">

                Net RR

              </span>

              <span className="text-blue-400 font-semibold">

                +247

              </span>

            </div>

            <div className="flex justify-between">

              <span className="text-slate-400">

                Profit Factor

              </span>

              <span className="text-yellow-400 font-semibold">

                2.34

              </span>

            </div>

            <div className="flex justify-between">

              <span className="text-slate-400">

                Maximum Drawdown

              </span>

              <span className="text-red-400 font-semibold">

                5.6%

              </span>

            </div>

          </div>

        </div>

      </div>

    </MainLayout>
  );
}

export default Dashboard;