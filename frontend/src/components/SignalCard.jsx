import { TrendingUp } from "lucide-react";

function SignalCard() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">

      <div className="flex justify-between">

        <h2 className="text-xl font-semibold text-white">

          Current Signal

        </h2>

        <TrendingUp
          className="text-green-500"
        />

      </div>

      <div className="mt-8">

        <div className="bg-green-600 px-5 py-2 rounded-xl inline-block">

          BUY

        </div>

      </div>

      <div className="space-y-6 mt-8">

        <div>

          <p className="text-slate-400 text-sm">

            Entry

          </p>

          <h2 className="text-white text-xl font-bold">

            3378.20

          </h2>

        </div>

        <div>

          <p className="text-slate-400 text-sm">

            Stop Loss

          </p>

          <h2 className="text-red-400 text-xl font-bold">

            3375.80

          </h2>

        </div>

        <div>

          <p className="text-slate-400 text-sm">

            Target

          </p>

          <h2 className="text-green-400 text-xl font-bold">

            3383.00

          </h2>

        </div>

        <div>

          <p className="text-slate-400 text-sm">

            Risk Reward

          </p>

          <h2 className="text-blue-400 text-xl font-bold">

            1 : 2

          </h2>

        </div>

      </div>

    </div>
  );
}

export default SignalCard;