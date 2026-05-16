"use client"

import { useState } from "react"
import { toast } from "sonner"

type ShareQuestionStartCardProps = {
  uuid: string
  title: string
  description: string
}

type ApiResponse = {
  error?: string
  message?: string
}

export function ShareQuestionStartCard({
  uuid,
  title,
  description,
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
    <div className="mx-auto mt-10 w-full max-w-2xl rounded-lg border border-gray-200 bg-white p-6">
      <div className="mb-4 text-xs font-medium uppercase tracking-wide text-pink-500">
        Share Soal
      </div>
      <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
      <p className="mt-2 text-gray-600">{description}</p>

      <form className="mt-6 space-y-3" onSubmit={handleSubmit}>
        <label htmlFor="participant-name" className="block text-sm text-gray-600">
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
          className="w-full rounded-md bg-pink-500 py-2 font-medium text-white disabled:opacity-70"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Menyimpan..." : "Mulai Mengerjakan"}
        </button>
      </form>
    </div>
  )
}
