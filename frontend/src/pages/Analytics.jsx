import MainLayout from "../layouts/MainLayout";

import AnalyticsCards from "../components/AnalyticsCards";
import EquityChart from "../components/EquityChart";

function Analytics() {

  return (

    <MainLayout>

      <div className="space-y-6 sm:space-y-8">

        <div>
        <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">

          Analytics

        </h1>
        <p className="mt-2 text-sm text-slate-400">Performance metrics from your latest backtest.</p>
        </div>

        <AnalyticsCards />

        <EquityChart />

      </div>

    </MainLayout>

  );

}

export default Analytics;
