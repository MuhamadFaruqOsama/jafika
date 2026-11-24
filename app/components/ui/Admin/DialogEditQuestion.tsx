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
import { InputTpAdmin } from "./InputTpAdmin"
import { QuestionTypeAdmin } from "./QuestionTypeAdmin"
import { InputCorrectNumber } from "./InputCorrectNumber"
import { AdditionalSettingsAdmin } from "./AdditionalSettingsAdmin"
import { toast } from "sonner"

type EditQuestionPayload = {
  uuid: string
  title: string
  description: string
  material: string | null
  kpk_mode: boolean
  fpb_mode: boolean
  find_number: unknown
  public_access: boolean
  assistant_3d: boolean
  cp?: string | null
  tp?: unknown
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

function normalizeFindNumber(value: unknown, isPemfaktoran: boolean) {
  if (!Array.isArray(value)) return isPemfaktoran ? [0] : [0, 0]

  const numbers = value
    .map((item) => Number(item))
    .filter((item) => Number.isFinite(item))

  if (isPemfaktoran) {
    return numbers.length >= 1 ? [numbers[0]] : [0]
  }

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
  const [cp, setCp] = useState("")
  const [tpList, setTpList] = useState<string[]>([""])
  const [kpkMode, setKpkMode] = useState(true)
  const [fpbMode, setFpbMode] = useState(true)
  const [pemfaktoranMode, setPemfaktoranMode] = useState(false)
  const [findNumber, setFindNumber] = useState<number[]>([0, 0])
  const [publicAccess, setPublicAccess] = useState(true)
  const [assistant3d, setAssistant3d] = useState(true)
  const [materialFile, setMaterialFile] = useState<File | null>(null)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [clearFileSignal, setClearFileSignal] = useState(0)

  const handleKpkChange = (checked: boolean) => {
    setKpkMode(checked)
    if (checked) {
      setPemfaktoranMode(false)
      if (findNumber.length < 2) {
        setFindNumber([findNumber[0] ?? 0, 0])
      }
    }
  }

  const handleFpbChange = (checked: boolean) => {
    setFpbMode(checked)
    if (checked) {
      setPemfaktoranMode(false)
      if (findNumber.length < 2) {
        setFindNumber([findNumber[0] ?? 0, 0])
      }
    }
  }

  const handlePemfaktoranChange = (checked: boolean) => {
    setPemfaktoranMode(checked)
    if (checked) {
      setKpkMode(false)
      setFpbMode(false)
      setFindNumber([findNumber[0] ?? 0])
    } else {
      setKpkMode(true)
      setFindNumber([findNumber[0] ?? 0, 0])
    }
  }

  useEffect(() => {
    if (!open) return

    const isPem = !question.kpk_mode && !question.fpb_mode
    setTitle(question.title)
    setDescription(question.description)
    setCp(question.cp ?? "")
    const initialTp = Array.isArray(question.tp)
      ? (question.tp as unknown[]).map(String).filter((s) => s.trim().length > 0)
      : []
    setTpList(initialTp.length > 0 ? initialTp : [""])
    setKpkMode(question.kpk_mode)
    setFpbMode(question.fpb_mode)
    setPemfaktoranMode(isPem)
    setFindNumber(normalizeFindNumber(question.find_number, isPem))
    setPublicAccess(question.public_access)
    setAssistant3d(question.assistant_3d)
    setMaterialFile(null)
    setThumbnailFile(null)
    setClearFileSignal((prev) => prev + 1)
  }, [open, question])

  const handleSubmit = async () => {
    if (!kpkMode && !fpbMode && !pemfaktoranMode) {
      toast.error("Pilih minimal satu mode soal (KPK, FPB, atau Pemfaktoran).")
      return
    }

    if (pemfaktoranMode) {
      if (findNumber.length < 1 || !findNumber[0] || findNumber[0] <= 1) {
        toast.error("Masukkan 1 bilangan yang valid (minimal lebih dari 1) untuk difaktorkan.")
        return
      }
    } else {
      if (findNumber.length < 2 || findNumber.some((n) => n <= 1)) {
        toast.error("Minimal isi dua bilangan valid (lebih dari 1) untuk dicari.")
        return
      }
    }

    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append("title", title)
      formData.append("description", description)
      formData.append("cp", cp.trim())
      formData.append(
        "tp",
        JSON.stringify(tpList.map((item) => item.trim()).filter((item) => item.length > 0))
      )
      formData.append("kpkMode", String(kpkMode))
      formData.append("fpbMode", String(fpbMode))
      formData.append("findNumber", JSON.stringify(pemfaktoranMode ? [findNumber[0]] : findNumber))
      formData.append("publicAccess", String(publicAccess))
      formData.append("assistant3d", String(assistant3d))

      if (materialFile) {
        formData.append("material", materialFile)
      }

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
            pemfaktoranMode={pemfaktoranMode}
            onKpkModeChange={handleKpkChange}
            onFpbModeChange={handleFpbChange}
            onPemfaktoranModeChange={handlePemfaktoranChange}
          />
          <TextAreaAdmin
            label="Deskripsi"
            id="edit-description"
            placeholder="Masukkan deskripsi soal"
            description="Masukkan soal deskripsi yang harus dipecahkan."
            value={description}
            onValueChange={setDescription}
          />
          <TextAreaAdmin
            label="Capaian Pembelajaran (CP)"
            id="edit-cp"
            placeholder="Contoh: Peserta didik dapat memahami konsep faktor dan kelipatan, menentukan faktorisasi prima..."
            description="Deskripsi capaian pembelajaran Kurikulum Merdeka (opsional)."
            value={cp}
            onValueChange={setCp}
          />
          <InputTpAdmin
            values={tpList}
            onValuesChange={setTpList}
          />
          <InputCorrectNumber
            values={findNumber}
            onValuesChange={setFindNumber}
            isPemfaktoran={pemfaktoranMode}
          />
          <InputAdmin
            key={`edit-material-${clearFileSignal}`}
            label="Ganti Materi PDF (Opsional)"
            id="edit-material"
            type="file"
            placeholder="Pilih materi baru"
            description={
              question.material
                ? "Jika tidak dipilih, materi lama akan tetap digunakan."
                : "Unggah materi PDF jika diperlukan."
            }
            onFileChange={setMaterialFile}
            fileKind="pdf"
          />
          <InputAdmin
            key={`edit-thumbnail-${clearFileSignal}`}
            label="Ganti Thumbnail (Opsional)"
            id="edit-thumbnail"
            type="file"
            placeholder="Pilih thumbnail baru"
            description="Jika tidak dipilih, thumbnail lama akan tetap digunakan."
            onFileChange={setThumbnailFile}
            fileKind="image"
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
