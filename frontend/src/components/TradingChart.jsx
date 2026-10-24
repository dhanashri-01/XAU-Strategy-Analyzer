import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";
import { useTheme } from "../context/ThemeContext";

function TradingChart() {
  const { theme } = useTheme();
  return (
    <section aria-labelledby="market-chart-heading" className="min-w-0 rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-6">
      <div className="mb-5">
        <h2 id="market-chart-heading" className="text-xl font-semibold text-white sm:text-2xl">Trading chart</h2>
        <p className="mt-2 inline-flex items-center gap-2 text-sm text-slate-400">
          <span className="size-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
          OANDA:XAUUSD <span aria-hidden="true">/</span> 5 minute
        </p>
      </div>
      <div className="h-[380px] w-full overflow-hidden rounded-xl sm:h-[480px] xl:h-[560px]" aria-label="Live XAUUSD market chart">
        <AdvancedRealTimeChart symbol="OANDA:XAUUSD" theme={theme} interval="5" width="100%" height="100%" />
      </div>
    </section>
  );
}

export default TradingChart;
