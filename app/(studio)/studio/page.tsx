import { AdminHeader } from "../../components/ui/Admin/AdminHeader";
import { AdminTable } from "../../components/ui/Admin/AdminTable";
import { LastQuestionCardAdmin } from "../../components/ui/Admin/LastQuestionCardAdmin";
import { TotalQuestionCardAdmin } from "../../components/ui/Admin/TotalQuestionCardAdmin";

export default function Dashboard() {
    return (
        <>
            <AdminHeader title="Home" />

            <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="col-span-2 border bg-white border-gray-200 p-2 rounded-lg">
                    <div className="text-gray-900 my-3 text-lg font-medium flex items-center gap-3">
                        Pengguna yang Terakhir Mengerjakan Soal Anda
                    </div>
                    <AdminTable/>
                </div>
                <div className="col-span-1 space-y-3">
                    <LastQuestionCardAdmin/>
                    <TotalQuestionCardAdmin/>
                </div>
            </div>
        </>
    )
}