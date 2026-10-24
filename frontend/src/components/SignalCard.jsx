import { ArrowDownRight, ArrowUpRight, Activity } from "lucide-react";
import { useBacktest } from "../context/BacktestContext";

function SignalCard() {
  const { backtest } = useBacktest();
  const isBuy = backtest?.signal === "BUY";
  return (
    <section aria-labelledby="signal-heading" className="metric-card rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-900/60 p-5 shadow-lg sm:p-6">

      <div className="flex justify-between">

        <h2 id="signal-heading" className="text-lg font-semibold text-white">

          Current Signal

        </h2>

        <Activity className="text-emerald-400" aria-hidden="true" />

      </div>

      {backtest ? <>
      <div className={`mt-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${isBuy ? "bg-emerald-400/10 text-emerald-300" : "bg-rose-400/10 text-rose-300"}`}>
        {isBuy ? <ArrowUpRight size={18} aria-hidden="true" /> : <ArrowDownRight size={18} aria-hidden="true" />}
        {backtest.signal || "No signal"}
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-5">

        <div>

          <dt className="text-slate-400 text-sm">

            Entry

          </dt>

          <dd className="mt-1 text-lg font-semibold text-white sm:text-xl">

            {backtest.entry ?? "-"}

          </dd>

        </div>

        <div>

          <dt className="text-slate-400 text-sm">

            Stop Loss

          </dt>

          <dd className="mt-1 text-lg font-semibold text-rose-300 sm:text-xl">

            {backtest.stopLoss ?? "-"}

          </dd>

        </div>

        <div>

          <dt className="text-slate-400 text-sm">

            Target

          </dt>

          <dd className="mt-1 text-lg font-semibold text-emerald-300 sm:text-xl">

            {backtest.target ?? "-"}

          </dd>

        </div>

        <div>

          <dt className="text-slate-400 text-sm">

            Risk Reward

          </dt>

          <dd className="mt-1 text-lg font-semibold text-sky-300 sm:text-xl">

            {backtest.rr ?? "-"}

          </dd>

        </div>

      </dl>
      </> : <p className="mt-6 rounded-xl border border-dashed border-slate-700 p-4 text-sm leading-6 text-slate-400">Run a backtest to see its signal, entry, stop loss, and target here.</p>}

    </section>
  );
}

export default SignalCard;
