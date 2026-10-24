import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
} from "recharts";
import { useBacktest } from "../context/BacktestContext";
import { useTheme } from "../context/ThemeContext";

function EquityChart() {
  const { backtest } = useBacktest();
  const { theme } = useTheme();
  const gridColor = theme === "dark" ? "#2b2f3a" : "#e0e3eb";
  const axisColor = theme === "dark" ? "#848e9c" : "#707a8a";
  const tooltipBackground = theme === "dark" ? "#1e222d" : "#ffffff";
  const data = (backtest?.equityCurve || []).map((balance, index) => ({ trade: index + 1, balance }));

  return (
    <section aria-labelledby="equity-heading" className="min-w-0 rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-6">
      <h2 id="equity-heading" className="mb-6 text-lg font-semibold text-white sm:text-xl">Equity curve</h2>
      {data.length ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid stroke={gridColor} />
            <XAxis dataKey="trade" stroke={axisColor} />
            <YAxis stroke={axisColor} />
            <Tooltip contentStyle={{ background: tooltipBackground, borderColor: gridColor, borderRadius: 12, color: theme === "dark" ? "#edf5ef" : "#19271e" }} />
            <Line type="monotone" dataKey="balance" stroke={theme === "dark" ? "#26a69a" : "#00897b"} strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex min-h-48 items-center justify-center rounded-xl border border-dashed border-slate-700 px-5 text-center text-sm text-slate-400" role="status">
          Run a backtest with trade history to display an equity curve.
        </div>
      )}
    </section>
  );
}

export default EquityChart;
