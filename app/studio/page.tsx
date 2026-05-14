import { AdminHeader } from "../components/ui/AdminHeader";
import { AdminTable } from "../components/ui/AdminTable";
import { LastQuestionCardAdmin } from "../components/ui/LastQuestionCardAdmin";
import { TotalQuestionCardAdmin } from "../components/ui/TotalQuestionCardAdmin";

export default function Dashboard() {
    return (
        <>
            <AdminHeader title="Home" />

            <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="col-span-2">
                    <div className="text-gray-900 mb-3">
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