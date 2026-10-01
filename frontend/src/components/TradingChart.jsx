import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";

function TradingChart() {
  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8">

      <div className="mb-6">
        <h2 className="text-4xl font-bold text-white">
          Trading Chart
        </h2>

        <p className="text-slate-400 mt-2 text-lg">
          XAUUSD • 5 Minute Timeframe
        </p>
      </div>

      <div className="w-full h-[700px] rounded-xl overflow-hidden">

                <AdvancedRealTimeChart
            symbol="OANDA:XAUUSD"
            theme="dark"
            interval="5"
            width="100%"
            height="700"
        />

      </div>

    </div>
  );
}

export default TradingChart;