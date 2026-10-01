import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function EquityChart() {

  const data = [
    { trade: 1, balance: 10000 },
    { trade: 2, balance: 10200 },
    { trade: 3, balance: 10150 },
    { trade: 4, balance: 10450 },
    { trade: 5, balance: 10700 },
    { trade: 6, balance: 11100 },
    { trade: 7, balance: 10950 },
    { trade: 8, balance: 11400 },
    { trade: 9, balance: 11850 },
    { trade: 10, balance: 12400 },
  ];

  return (

    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

      <h2 className="text-xl font-bold text-white mb-6">

        Equity Curve

      </h2>

      <ResponsiveContainer width="100%" height={320}>

        <LineChart data={data}>

          <CartesianGrid stroke="#334155" />

          <XAxis
            dataKey="trade"
            stroke="#94a3b8"
          />

          <YAxis stroke="#94a3b8" />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="balance"
            stroke="#22c55e"
            strokeWidth={3}
            dot={false}
          />

        </LineChart>

      </ResponsiveContainer>

    </div>

  );

}

export default EquityChart;