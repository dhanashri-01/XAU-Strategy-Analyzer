import { Activity, BarChart3, Target, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import StatCard from "../components/StatCard";
import ChartCard from "../components/ChartCard";
import SignalCard from "../components/SignalCard";
import StrategyPanel from "../components/StrategyForm";
import { useBacktest } from "../context/BacktestContext";

function Dashboard() {
  const { backtest } = useBacktest();
  const stats = [
    { title: "Accuracy", value: backtest ? `${backtest.accuracy}%` : "-", icon: Target, color: "bg-sky-500/80" },
    { title: "Trades", value: backtest?.trades ?? "-", icon: BarChart3, color: "bg-violet-500/80" },
    { title: "Wins", value: backtest?.wins ?? "-", icon: Trophy, color: "bg-emerald-500/80" },
    { title: "Net RR", value: backtest?.netRR ?? "-", icon: Activity, color: "bg-amber-500/80" },
  ];

  return (
    <MainLayout>
      <section className="dashboard-hero relative mb-7 overflow-hidden rounded-3xl border border-slate-800 border-t-2 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/50 p-5 sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-24 size-72 rounded-full bg-emerald-400/10 blur-3xl" />
        <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-300">
          <span className="size-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
          XAUUSD <span className="text-slate-500" aria-hidden="true">/</span> Research workspace
        </p>
        <h1 className="max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">Turn your strategy rules into measurable results.</h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">Backtest ICT and Fibonacci setups against your own candle data, then review every run.</p>
        <Link to="/strategy" className="mt-6 inline-flex min-h-11 items-center rounded-lg bg-emerald-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200">Configure a backtest</Link>
      </section>

      <section aria-label="Latest backtest metrics" className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5">
        {stats.map((card) => <StatCard key={card.title} {...card} />)}
      </section>

      <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-3 xl:gap-6">
        <div className="min-w-0 xl:col-span-2"><ChartCard /></div>
        <SignalCard />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-3 xl:gap-6">
        <div className="min-w-0 xl:col-span-2"><StrategyPanel /></div>
        <section aria-labelledby="summary-heading" className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
          <h2 id="summary-heading" className="mb-5 text-lg font-semibold text-white">Backtest summary</h2>
          {backtest ? (
            <dl className="space-y-4">
              <div className="flex justify-between gap-3"><dt className="text-slate-400">Total trades</dt><dd className="font-semibold text-white">{backtest.trades}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-slate-400">Wins</dt><dd className="font-semibold text-emerald-300">{backtest.wins}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-slate-400">Losses</dt><dd className="font-semibold text-rose-300">{backtest.losses}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-slate-400">Accuracy</dt><dd className="font-semibold text-emerald-300">{backtest.accuracy}%</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-slate-400">Net RR</dt><dd className="font-semibold text-sky-300">{backtest.netRR}</dd></div>
            </dl>
          ) : <p className="text-sm leading-6 text-slate-400">Your latest run summary will appear here after you complete a backtest.</p>}
        </section>
      </div>
    </MainLayout>
  );
}

export default Dashboard;
