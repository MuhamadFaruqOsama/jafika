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
  value?: string
  onValueChange?: (value: string) => void
  onFileChange?: (file: File | null) => void
  fileAccept?: string
  fileKind?: "image" | "pdf"
}

export function InputAdmin({
  label,
  id,
  type,
  placeholder,
  description,
  value,
  onValueChange,
  onFileChange,
  fileAccept,
  fileKind = "image",
}: InputAdminProps) {
  const [previewSrc, setPreviewSrc] = useState<string | null>(null)
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null)
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
      setSelectedFileName(null)
      onFileChange?.(null)
      return
    }

    const isPdf =
      selectedFile.type === "application/pdf" ||
      selectedFile.name.toLowerCase().endsWith(".pdf")
    const isImage = selectedFile.type.startsWith("image/")
    const isAllowed = fileKind === "pdf" ? isPdf : isImage

    if (!isAllowed) {
      event.target.value = ""
      setPreviewSrc(null)
      setSelectedFileName(null)
      onFileChange?.(null)
      return
    }

    setSelectedFileName(selectedFile.name)
    if (fileKind === "image") {
      const filePreview = URL.createObjectURL(selectedFile)
      setPreviewSrc(filePreview)
    } else {
      setPreviewSrc(null)
    }

    onFileChange?.(selectedFile)
  }

  const handleClearFile = () => {
    setPreviewSrc(null)
    setSelectedFileName(null)
    onFileChange?.(null)

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
        value={type === "file" ? undefined : value}
        onChange={
          type === "file"
            ? handleFileChange
            : (event) => onValueChange?.(event.target.value)
        }
        accept={
          type === "file"
            ? fileAccept ?? (fileKind === "pdf" ? "application/pdf,.pdf" : "image/*")
            : undefined
        }
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
      {type === "file" && !previewSrc && selectedFileName && (
        <div className="mt-3 flex items-center justify-between rounded-md border border-gray-200 bg-gray-50 p-2">
          <div className="text-sm text-gray-700 line-clamp-1">{selectedFileName}</div>
          <button
            type="button"
            className="p-2 bg-red-500 text-white rounded-md cursor-pointer hover:bg-red-600 transition-all duration-300"
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
