import MainLayout from "../layouts/MainLayout";
import HistoryTable from "../components/HistoryTable";

function History() {

    return (

        <MainLayout>

            <div className="space-y-8">

                <h1 className="text-4xl font-bold text-white">

                    History

                </h1>

                <HistoryTable />

            </div>

        </MainLayout>

    );

}

export default History;