import { AdminHeader } from "../components/ui/AdminHeader";
import { LastQuestionCardAdmin } from "../components/ui/LastQuestionCardAdmin";
import { TotalQuestionCardAdmin } from "../components/ui/TotalQuestionCardAdmin";

export default function Dashboard() {
    return (
        <>
            <AdminHeader title="Home" />

            <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="col-span-2">
                    
                </div>
                <div className="col-span-1 space-y-3">
                    <LastQuestionCardAdmin/>
                    <TotalQuestionCardAdmin/>
                </div>
            </div>
        </>
    )
}