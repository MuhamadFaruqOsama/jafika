"use client"

import { ChangeEvent, useEffect, useRef, useState } from "react"
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { HugeiconsIcon } from "@hugeicons/react"
import { Delete03Icon } from "@hugeicons/core-free-icons"

type InputAdminProps = {
  label: string
  id: string
  type: string
  placeholder: string
  description: string
}

export function InputAdmin({ label, id, type, placeholder, description }: InputAdminProps) {
  const [previewSrc, setPreviewSrc] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    return () => {
      if (previewSrc) {
        URL.revokeObjectURL(previewSrc)
      }
    }
  }, [previewSrc])

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]

    if (!selectedFile) {
      setPreviewSrc(null)
      return
    }

    if (!selectedFile.type.startsWith("image/")) {
      event.target.value = ""
      setPreviewSrc(null)
      return
    }

    const filePreview = URL.createObjectURL(selectedFile)
    setPreviewSrc(filePreview)
  }

  const handleClearFile = () => {
    setPreviewSrc(null)

    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  return (
    <Field>
      <FieldLabel htmlFor={id} className="text-base">{label}</FieldLabel>
      <Input
        ref={inputRef}
        id={id}
        type={type}
        placeholder={placeholder}
        accept={type === "file" ? "image/*" : undefined}
        onChange={type === "file" ? handleFileChange : undefined}
      />
      {type === "file" && previewSrc && (
        <div className="mt-3 relative">
          <Image
            src={previewSrc}
            alt="Preview gambar"
            width={320}
            height={180}
            className="rounded-md object-cover border border-gray-200"
          />
          <button
            type="button"
            className="absolute top-2 left-2 p-2 bg-red-500 text-white rounded-md cursor-pointer hover:bg-red-600 transition-all duration-300"
            onClick={handleClearFile}
          >
            <HugeiconsIcon icon={Delete03Icon} size={20}/>
          </button>
        </div>
      )}
      <FieldDescription>
        {description}
      </FieldDescription>
    </Field>
  )
}
