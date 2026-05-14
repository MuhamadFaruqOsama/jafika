import { AdminHeader } from "@/app/components/ui/Admin/AdminHeader";
import { AdminQuestionCard } from "@/app/components/ui/Admin/AdminQuestionCard";
import { DialogAddQuestion } from "@/app/components/ui/Admin/DialogAddQuestion";

export default function Soal() {
    return (
        <>
            <AdminHeader title="Soal" />

            {/* add button */}
            <div className="flex justify-end">
                <DialogAddQuestion/>
            </div>

            {/* soal list */}
            <div className="grid grid-cols-3 gap-4">
                <AdminQuestionCard/>
            </div>
        </>
    )
}