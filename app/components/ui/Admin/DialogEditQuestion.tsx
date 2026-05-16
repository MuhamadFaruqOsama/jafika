"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ButtonAdmin } from "./ButtonAdmin"
import { HugeiconsIcon } from "@hugeicons/react"
import { AddInvoiceIcon } from "@hugeicons/core-free-icons"
import { InputAdmin } from "./InputAdmin"
import { TextAreaAdmin } from "./TextAreaAdmin"
import { QuestionTypeAdmin } from "./QuestionTypeAdmin"
import { InputCorrectNumber } from "./InputCorrectNumber"
import { AdditionalSettingsAdmin } from "./AdditionalSettingsAdmin"
import { toast } from "sonner"

type EditQuestionPayload = {
  uuid: string
  title: string
  description: string
  kpk_mode: boolean
  fpb_mode: boolean
  find_number: unknown
  public_access: boolean
  assistant_3d: boolean
}

type DialogEditQuestionProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  question: EditQuestionPayload
  onUpdated: () => void
}

type UpdateQuestionResponse = {
  error?: string
  message?: string
}

function normalizeFindNumber(value: unknown) {
  if (!Array.isArray(value)) return [0, 0]

  const numbers = value
    .map((item) => Number(item))
    .filter((item) => Number.isFinite(item))

  if (numbers.length < 2) return [0, 0]
  return numbers
}

export function DialogEditQuestion({
  open,
  onOpenChange,
  question,
  onUpdated,
}: DialogEditQuestionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [kpkMode, setKpkMode] = useState(true)
  const [fpbMode, setFpbMode] = useState(true)
  const [findNumber, setFindNumber] = useState<number[]>([0, 0])
  const [publicAccess, setPublicAccess] = useState(true)
  const [assistant3d, setAssistant3d] = useState(true)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [clearFileSignal, setClearFileSignal] = useState(0)

  useEffect(() => {
    if (!open) return

    setTitle(question.title)
    setDescription(question.description)
    setKpkMode(question.kpk_mode)
    setFpbMode(question.fpb_mode)
    setFindNumber(normalizeFindNumber(question.find_number))
    setPublicAccess(question.public_access)
    setAssistant3d(question.assistant_3d)
    setThumbnailFile(null)
    setClearFileSignal((prev) => prev + 1)
  }, [open, question])

  const handleSubmit = async () => {
    if (!kpkMode && !fpbMode) {
      toast.error("Pilih minimal satu mode soal (KPK atau FPB).")
      return
    }

    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append("title", title)
      formData.append("description", description)
      formData.append("kpkMode", String(kpkMode))
      formData.append("fpbMode", String(fpbMode))
      formData.append("findNumber", JSON.stringify(findNumber))
      formData.append("publicAccess", String(publicAccess))
      formData.append("assistant3d", String(assistant3d))

      if (thumbnailFile) {
        formData.append("thumbnail", thumbnailFile)
      }

      const response = await fetch(`/api/question/${question.uuid}`, {
        method: "PATCH",
        body: formData,
      })

      const payload = (await response.json()) as UpdateQuestionResponse
      if (!response.ok) {
        toast.error(payload.error ?? "Gagal memperbarui soal.")
        return
      }

      toast.success(payload.message ?? "Soal berhasil diperbarui.")
      onOpenChange(false)
      onUpdated()
    } catch {
      toast.error("Terjadi kendala jaringan. Coba lagi.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white min-w-[80%]">
        <DialogHeader>
          <DialogTitle className="text-lg">Edit Soal</DialogTitle>
          <DialogDescription>
            Perbarui data soal Anda sesuai kebutuhan.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 no-scrollbar max-h-[70vh] overflow-y-auto">
          <InputAdmin
            label="Judul"
            id="edit-title"
            type="text"
            placeholder="Masukkan judul soal"
            description="Judul akan digunakan sebagai thumbnail soal."
            value={title}
            onValueChange={setTitle}
          />
          <QuestionTypeAdmin
            kpkMode={kpkMode}
            fpbMode={fpbMode}
            onKpkModeChange={setKpkMode}
            onFpbModeChange={setFpbMode}
          />
          <TextAreaAdmin
            label="Deskripsi"
            id="edit-description"
            placeholder="Masukkan deskripsi soal"
            description="Masukkan soal deskripsi yang harus dipecahkan."
            value={description}
            onValueChange={setDescription}
          />
          <InputCorrectNumber values={findNumber} onValuesChange={setFindNumber} />
          <InputAdmin
            key={`edit-thumbnail-${clearFileSignal}`}
            label="Ganti Thumbnail (Opsional)"
            id="edit-thumbnail"
            type="file"
            placeholder="Pilih thumbnail baru"
            description="Jika tidak dipilih, thumbnail lama akan tetap digunakan."
            onFileChange={setThumbnailFile}
          />
          <AdditionalSettingsAdmin
            publicAccess={publicAccess}
            assistant3d={assistant3d}
            onPublicAccessChange={setPublicAccess}
            onAssistant3dChange={setAssistant3d}
          />
        </div>

        <DialogFooter className="bg-white">
          <div className="flex justify-end">
            <ButtonAdmin
              disabled={isSubmitting}
              onClick={handleSubmit}
            >
              <HugeiconsIcon icon={AddInvoiceIcon} size={20} />
              {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
            </ButtonAdmin>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
