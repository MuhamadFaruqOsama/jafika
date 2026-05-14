import { AdminHeader } from "@/app/components/ui/Admin/AdminHeader";
import { AdminQuestionCard } from "@/app/components/ui/Admin/AdminQuestionCard";
import { ButtonAdmin } from "@/app/components/ui/Admin/ButtonAdmin";
import { AddInvoiceIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export default function Soal() {
    return (
        <>
            <AdminHeader title="Soal" />

            {/* add button */}
            <div className="flex justify-end">
                <ButtonAdmin>
                    <HugeiconsIcon icon={AddInvoiceIcon} size={20}/>
                    Tambah Soal
                </ButtonAdmin>
            </div>

            {/* soal list */}
            <div className="grid grid-cols-3 gap-4">
                <AdminQuestionCard/>
            </div>
        </>
    )
}