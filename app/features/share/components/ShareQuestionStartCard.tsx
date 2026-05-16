"use client"

import { CheckmarkCircle03Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useState } from "react"
import { toast } from "sonner"

type ShareQuestionStartCardProps = {
  uuid: string
  title: string
  description: string
  kpk_mode: boolean
  fpb_mode: boolean
}

type ApiResponse = {
  error?: string
  message?: string
}

export function ShareQuestionStartCard({
  uuid,
  title,
  description,
  kpk_mode,
  fpb_mode
}: ShareQuestionStartCardProps) {
  const [name, setName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/share/${uuid}/participant`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      })

      const payload = (await response.json()) as ApiResponse
      if (!response.ok) {
        toast.error(payload.error ?? "Gagal mulai mengerjakan soal.")
        return
      }

      toast.success(payload.message ?? "Data peserta tersimpan.")
      setName("")
    } catch {
      toast.error("Terjadi kendala jaringan. Coba lagi.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto mt-10 w-full md:max-w-2xl rounded-lg border border-gray-200 bg-white p-3">
      <div className="mb-4 text-sm text-white font-semibold bg-pink-400 py-0.5 px-3 rounded-full w-fit">
        Share Soal
      </div>
      <div className="text-gray-600 mt-4">
        <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
        <p>{description}</p>
        <div className="mt-4">
          <p>Dibuat oleh: </p>
          <p className="flex gap-2 items-center">Jenis soal:
            {
              kpk_mode && (
                <div className="px-2 py-0.5 rounded-md bg-pink-400 text-white flex items-center gap-1 text-sm font-semibold">
                  <HugeiconsIcon icon={CheckmarkCircle03Icon} size={15}/>
                  KPK
                </div>
              )
            }
            {
              fpb_mode && (
                <div className="px-2 py-0.5 rounded-md bg-orange-400 text-white flex items-center gap-1 text-sm font-semibold">
                  <HugeiconsIcon icon={CheckmarkCircle03Icon} size={15}/>
                  FPB
                </div>
              )
            }
          </p>
        </div>
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
