import { TrendingUp } from "lucide-react";

function StatCard({
  title,
  value,
  icon: Icon,
  color,
  change,
}) {
  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 hover:border-green-500 transition-all duration-300 shadow-lg">

      <div className="flex justify-between items-center">

        <div>

          <p className="text-slate-400 text-sm">

            {title}

          </p>

          <h2 className="text-3xl font-bold text-white mt-2">

            {value}

          </h2>

        </div>

        <div
          className={`w-14 h-14 rounded-xl flex items-center justify-center ${color}`}
        >

          <Icon className="text-white" size={28} />

        </div>

      </div>

      <div className="flex items-center gap-2 mt-6">

        <TrendingUp
          size={18}
          className="text-green-400"
        />

        <span className="text-green-400 font-medium">

          {change}

        </span>

      </div>

    </div>
  );
}

export default StatCard;