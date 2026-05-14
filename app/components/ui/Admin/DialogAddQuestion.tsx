import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ButtonAdmin } from "./ButtonAdmin"
import { HugeiconsIcon } from "@hugeicons/react"
import { AddInvoiceIcon } from "@hugeicons/core-free-icons"
import { InputAdmin } from "./InputAdmin"
import { TextAreaAdmin } from "./TextAreaAdmin"
import { QuestionTypeAdmin } from "./QuestionTypeAdmin"

export function DialogAddQuestion() {
    return (
        <Dialog>
        <DialogTrigger>
            <ButtonAdmin>
                <HugeiconsIcon icon={AddInvoiceIcon} size={20}/>
                Tambah Soal
            </ButtonAdmin>
        </DialogTrigger>
        <DialogContent className="bg-white min-w-[80%]">
            <DialogHeader>
                <DialogTitle className="text-lg">Buat Soal</DialogTitle>
                <DialogDescription>
                    Anda bisa membuat soal lalu membagikannya ke orang lain.
                </DialogDescription>
            </DialogHeader>
            {/* form for adding question */}
            <form className="space-y-5">
                <InputAdmin
                    label="Judul"
                    id="title"
                    type="text"
                    placeholder="Masukkan judul soal"
                    description="Judul akan digunakan sebagai thumbnail soal."
                />
                <QuestionTypeAdmin/>
                <TextAreaAdmin
                    label="Deskripsi"
                    id="description"
                    placeholder="Masukkan deskripsi soal"
                    description="Masukkan soal deskripsi yang harus dipecahkan."
                />
                <div className="flex justify-end">
                    <ButtonAdmin>
                        <HugeiconsIcon icon={AddInvoiceIcon} size={20}/>
                        Tambahkan Soal
                    </ButtonAdmin>
                </div>
            </form>
            {/* form for adding question */}
        </DialogContent>
        </Dialog>
    )
}