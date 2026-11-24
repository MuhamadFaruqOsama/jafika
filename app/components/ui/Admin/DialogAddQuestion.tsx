"use client"

import { useState } from "react"
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
import { InputTpAdmin } from "./InputTpAdmin"
import { AdditionalSettingsAdmin } from "./AdditionalSettingsAdmin"
import { toast } from "sonner"

type CreateQuestionResponse = {
  error?: string
  message?: string
}

export function DialogAddQuestion() {
    const [open, setOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [kpkMode, setKpkMode] = useState(true)
    const [fpbMode, setFpbMode] = useState(true)
    const [pemfaktoranMode, setPemfaktoranMode] = useState(false)
    const [findNumber, setFindNumber] = useState<number[]>([0, 0])
    const [publicAccess, setPublicAccess] = useState(true)
    const [assistant3d, setAssistant3d] = useState(true)
    const [materialFile, setMaterialFile] = useState<File | null>(null)
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
    const [clearFileSignal, setClearFileSignal] = useState(0)
    const [cp, setCp] = useState("")
    const [tpList, setTpList] = useState<string[]>([""])

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

    const resetForm = () => {
      setTitle("")
      setDescription("")
      setKpkMode(true)
      setFpbMode(true)
      setPemfaktoranMode(false)
      setFindNumber([0, 0])
      setPublicAccess(true)
      setAssistant3d(true)
      setMaterialFile(null)
      setThumbnailFile(null)
      setClearFileSignal((prev) => prev + 1)
      setCp("")
      setTpList([""])
    }

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
        formData.append("kpkMode", String(kpkMode))
        formData.append("fpbMode", String(fpbMode))
        formData.append("findNumber", JSON.stringify(pemfaktoranMode ? [findNumber[0]] : findNumber))
        formData.append("publicAccess", String(publicAccess))
        formData.append("assistant3d", String(assistant3d))
        formData.append("cp", cp.trim())
        formData.append("tp", JSON.stringify(tpList.map((s) => s.trim()).filter(Boolean)))

        if (materialFile) {
          formData.append("material", materialFile)
        }

        if (thumbnailFile) {
          formData.append("thumbnail", thumbnailFile)
        }

        const response = await fetch("/api/question", {
          method: "POST",
          body: formData,
        })

        const payload = (await response.json()) as CreateQuestionResponse
        if (!response.ok) {
          toast.error(payload.error ?? "Gagal membuat soal.")
          return
        }

        toast.success(payload.message ?? "Soal berhasil dibuat.")
        resetForm()
        setOpen(false)
      } catch {
        toast.error("Terjadi kendala jaringan. Coba lagi.")
      } finally {
        setIsSubmitting(false)
      }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <ButtonAdmin>
                    <HugeiconsIcon icon={AddInvoiceIcon} size={20}/>
                    Tambah Soal
                </ButtonAdmin>
            </DialogTrigger>
            <DialogContent className="bg-white min-w-[100%] md:min-w-[80%]">
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
                        id="description"
                        placeholder="Masukkan deskripsi soal"
                        description="Masukkan soal deskripsi yang harus dipecahkan."
                        value={description}
                        onValueChange={setDescription}
                    />
                    <TextAreaAdmin
                        label="Capaian Pembelajaran (CP)"
                        id="cp"
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
                        key={`material-${clearFileSignal}`}
                        label="Materi (pdf)"
                        id="material"
                        type="file"
                        placeholder="Masukkan materi soal"
                        description="Materi akan muncul ketika soal dibuka."
                        onFileChange={setMaterialFile}
                        fileKind="pdf"
                    />
                    <InputAdmin
                        key={`thumbnail-${clearFileSignal}`}
                        label="Thumbnail (16:9)"
                        id="thumbnail"
                        type="file"
                        placeholder="Masukkan thumbnail soal"
                        description="Thumbnail akan muncul ketika soal dibuka."
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
                {/* form for adding question */}
                <DialogFooter className="bg-white">
                    <div className="flex justify-end">
                        <ButtonAdmin
                          // type="button"
                          disabled={isSubmitting}
                          onClick={handleSubmit}
                        >
                            <HugeiconsIcon icon={AddInvoiceIcon} size={20}/>
                            {isSubmitting ? "Menyimpan..." : "Tambahkan Soal"}
                        </ButtonAdmin>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
