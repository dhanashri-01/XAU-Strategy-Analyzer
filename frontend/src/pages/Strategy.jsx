import MainLayout from "../layouts/MainLayout";
import StrategyForm from "../components/StrategyForm";

function Strategy() {
  return (
    <MainLayout>

      <div className="mb-6 sm:mb-8">

        <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Strategy Builder
        </h1>

        <p className="text-slate-400 mt-2">
          Configure your ICT Fibonacci strategy and run a backtest.
        </p>

      </div>

      <StrategyForm />

    </MainLayout>
  );
}

export default Strategy;
