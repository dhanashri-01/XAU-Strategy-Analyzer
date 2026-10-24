import MainLayout from "../layouts/MainLayout";
import HistoryTable from "../components/HistoryTable";

function History() {

    return (

        <MainLayout>

            <div className="space-y-6 sm:space-y-8">

                <div>
                <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">

                    History

                </h1>
                <p className="mt-2 text-sm text-slate-400">Saved results from your strategy tests.</p>
                </div>

                <HistoryTable />

            </div>

        </MainLayout>

    );

}

export default History;
