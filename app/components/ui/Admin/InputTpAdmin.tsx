"use client"

import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Add01Icon, Remove01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

type InputTpAdminProps = {
  values: string[]
  onValuesChange: (values: string[]) => void
}

export function InputTpAdmin({ values, onValuesChange }: InputTpAdminProps) {
  const currentValues = values.length > 0 ? values : [""]

  const handleAddField = () => {
    onValuesChange([...currentValues, ""])
  }

  const handleRemoveField = () => {
    if (currentValues.length <= 1) return
    onValuesChange(currentValues.slice(0, -1))
  }

  const handleValueChange = (index: number, text: string) => {
    const next = [...currentValues]
    next[index] = text
    onValuesChange(next)
  }

  return (
    <Field>
      <FieldLabel className="text-base flex justify-between">
        <div>Tujuan Pembelajaran (TP)</div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleAddField}
            className="w-7 h-7 bg-pink-500 rounded-lg flex items-center justify-center text-white font-bold cursor-pointer hover:bg-pink-600 transition-all duration-300"
            title="Tambah Tujuan Pembelajaran"
          >
            <HugeiconsIcon icon={Add01Icon} size={20} />
          </button>

          <button
            type="button"
            onClick={handleRemoveField}
            disabled={currentValues.length <= 1}
            className={`
              w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold transition-all duration-300
              ${
                currentValues.length <= 1
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-pink-500 hover:bg-pink-600 cursor-pointer"
              }
            `}
            title="Kurangi Tujuan Pembelajaran"
          >
            <HugeiconsIcon icon={Remove01Icon} size={20} />
          </button>
        </div>
      </FieldLabel>

      <div className="grid grid-cols-1 gap-3 border border-gray-200 p-2 rounded-md">
        {currentValues.map((tpValue, index) => (
          <div key={index} className="flex gap-3 items-center">
            <div>{index + 1}.</div>
            <Input
              type="text"
              value={tpValue}
              onChange={(e) => handleValueChange(index, e.target.value)}
              placeholder={`Tujuan pembelajaran ke-${index + 1}`}
            />
          </div>
        ))}
      </div>

      <FieldDescription>
        Daftar tujuan pembelajaran yang akan dicapai peserta didik (opsional).
      </FieldDescription>
    </Field>
  )
}
