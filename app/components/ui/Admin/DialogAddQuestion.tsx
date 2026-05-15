import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { InputCorrectNumber } from "./InputCorrectNumber"
import { AdditionalSettingsAdmin } from "./AdditionalSettingsAdmin"

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
                <div className="space-y-5 no-scrollbar max-h-[70vh] overflow-y-auto">
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
                    <InputCorrectNumber/>
                    <InputAdmin
                        label="Thumbnail (9:16)"
                        id="thumbnail"
                        type="file"
                        placeholder="Masukkan thumbnail soal"
                        description="Thumbnail akan muncul ketika soal dibuka."
                    />
                    <AdditionalSettingsAdmin/>
                </div>
                {/* form for adding question */}
                <DialogFooter className="bg-white">
                    <div className="flex justify-end">
                        <ButtonAdmin>
                            <HugeiconsIcon icon={AddInvoiceIcon} size={20}/>
                            Tambahkan Soal
                        </ButtonAdmin>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}