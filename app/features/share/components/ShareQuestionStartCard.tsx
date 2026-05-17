"use client"

import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import Image from "next/image"
import { JafikaPage } from "@/app/features/jafika/components/JafikaPage"
import { MaterialDownload } from "@/app/components/ui/MaterialDownload"

type ShareQuestionStartCardProps = {
  uuid: string
  title: string
  description: string
  creatorName: string
  material: string | null
  thumbnail: string | null
  kpk_mode: boolean
  fpb_mode: boolean
  assistant3d: boolean
}

type ApiResponse = {
  error?: string
  message?: string
  participantId?: number
}

export function ShareQuestionStartCard({
  uuid,
  title,
  description,
  creatorName,
  material,
  thumbnail,
  kpk_mode,
  fpb_mode,
  assistant3d,
}: ShareQuestionStartCardProps) {
  const storageKey = useMemo(() => `jafika-share-session:${uuid}`, [uuid])
  const [name, setName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [participantId, setParticipantId] = useState<number | null>(null)
  const [participantName, setParticipantName] = useState("")

  useEffect(() => {
    const rawSession = window.localStorage.getItem(storageKey)
    if (!rawSession) return

    try {
      const parsed = JSON.parse(rawSession) as {
        participantId?: number
        participantName?: string
      }
      const storedParticipantId = Number(parsed.participantId)

      if (
        Number.isInteger(storedParticipantId) &&
        storedParticipantId > 0 &&
        typeof parsed.participantName === "string" &&
        parsed.participantName.trim().length >= 2
      ) {
        setParticipantId(storedParticipantId)
        setParticipantName(parsed.participantName.trim())
      }
    } catch {
      window.localStorage.removeItem(storageKey)
    }
  }, [storageKey])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedName = name.replace(/\s+/g, " ").trim()
    if (trimmedName.length < 2) {
      toast.error("Nama peserta minimal 2 karakter.")
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/share/${uuid}/participant`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: trimmedName }),
      })

      const payload = (await response.json()) as ApiResponse
      if (!response.ok) {
        toast.error(payload.error ?? "Gagal mulai mengerjakan soal.")
        return
      }

      toast.success(payload.message ?? "Data peserta tersimpan.")
      const nextParticipantId = Number(payload.participantId)
      if (!Number.isInteger(nextParticipantId) || nextParticipantId <= 0) {
        toast.error("ID peserta tidak ditemukan. Silakan coba lagi.")
        return
      }

      setParticipantId(nextParticipantId)
      setParticipantName(trimmedName)
      window.localStorage.setItem(
        storageKey,
        JSON.stringify({
          participantId: nextParticipantId,
          participantName: trimmedName,
        }),
      )
    } catch {
      toast.error("Terjadi kendala jaringan. Coba lagi.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (participantId) {
    return (
      <JafikaPage
        shareConfig={{
          enabled: true,
          questionUuid: uuid,
          participantId,
          participantName,
          sessionStorageKey: storageKey,
          title,
          description,
          material,
          thumbnail,
          kpkMode: kpk_mode,
          fpbMode: fpb_mode,
          assistant3dEnabled: assistant3d,
        }}
      />
    )
  }

  return (
    <div className="mx-auto w-full md:max-w-2xl rounded-lg border border-gray-200 bg-white p-3">
      <div className="mb-4 text-sm text-white font-semibold bg-pink-400 py-0.5 px-3 rounded-full w-fit">
        Share Soal
      </div>
      <div className="text-gray-600 mt-4">
        <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-md border border-gray-200 bg-gray-100">
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-gray-500">
              Belum ada thumbnail
            </div>
          )}
        </div>
        <MaterialDownload materialPath={material} />
        <div className="my-5 text-end">
          <p>Dibuat oleh: <span>{creatorName}</span></p>
        </div>
        <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
        <p>{description}</p>
      </div>

      <form className="mt-6" onSubmit={handleSubmit}>
        <label htmlFor="participant-name" className="block text-base text-gray-600 mb-2">
          Nama Peserta
        </label>
        <input
          id="participant-name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Masukkan nama kamu"
          className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-pink-500"
          required
        />

        <button
          type="submit"
          className="w-full rounded-md bg-pink-500 py-2 font-medium text-white disabled:opacity-70 mt-5 cursor-pointer hover:bg-pink-600 transition-all duration-300"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Menyimpan..." : "Mulai Mengerjakan"}
        </button>
      </form>
    </div>
  )
}
