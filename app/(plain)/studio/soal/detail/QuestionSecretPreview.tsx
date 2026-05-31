"use client"

import { useState } from "react"
import { CheckmarkCircle03Icon, ViewIcon, ViewOffSlashIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

type QuestionSecretPreviewProps = {
  kpkMode: boolean
  fpbMode: boolean
  findNumbers: number[]
}

export function QuestionSecretPreview({
  kpkMode,
  fpbMode,
  findNumbers,
}: QuestionSecretPreviewProps) {
  const [isHidden, setIsHidden] = useState(true)

  return (
    <div className="border space-y-3 p-2 rounded-md relative">
      <button
        type="button"
        className="absolute top-2 right-2 cursor-pointer"
        onClick={() => setIsHidden((prev) => !prev)}
        aria-label={isHidden ? "Tampilkan detail soal" : "Sembunyikan detail soal"}
      >
        <HugeiconsIcon icon={isHidden ? ViewOffSlashIcon : ViewIcon} />
      </button>

      <div className="space-y-0">
        <div className="text-sm text-gray-500">tipe soal</div>
        <div className="text-base font-medium">
          {isHidden ? (
            <div className="text-base font-semibold tracking-[0.3em] text-gray-500">****</div>
          ) : (
            <div className="flex justify-start gap-1 text-sm font-semibold">
              {kpkMode && (
                <div className="flex items-center gap-1 rounded-md bg-pink-400 px-2 py-0.5 text-white">
                  <HugeiconsIcon icon={CheckmarkCircle03Icon} size={15} />
                  KPK
                </div>
              )}
              {fpbMode && (
                <div className="flex items-center gap-1 rounded-md bg-orange-400 px-2 py-0.5 text-white">
                  <HugeiconsIcon icon={CheckmarkCircle03Icon} size={15} />
                  FPB
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-0">
        <div className="text-sm text-gray-500">angka yang dicari</div>
        <div className="text-base font-medium">
          {isHidden ? (
            <div className="text-base font-semibold tracking-[0.3em] text-gray-500">****</div>
          ) : findNumbers.length === 0 ? (
            <span>-</span>
          ) : (
            <div className="flex flex-wrap gap-1">
              {findNumbers.map((value, index) => (
                <span
                  key={`${value}-${index}`}
                  className="rounded-md bg-pink-100 px-2 py-0.5 text-sm text-pink-700"
                >
                  {value}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
