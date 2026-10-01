import MainLayout from "../layouts/MainLayout";

import AnalyticsCards from "../components/AnalyticsCards";
import EquityChart from "../components/EquityChart";

function Analytics() {

  return (

    <MainLayout>

      <div className="space-y-8">

        <h1 className="text-4xl font-bold text-white">

          Analytics

        </h1>

        <AnalyticsCards />

        <EquityChart />

      </div>

    </MainLayout>

  );

}

export default Analytics;