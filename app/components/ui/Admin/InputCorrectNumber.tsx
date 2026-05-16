"use client"

import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Add01Icon, Remove01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

type InputCorrectNumberProps = {
  values: number[]
  onValuesChange: (values: number[]) => void
}

export function InputCorrectNumber({ values, onValuesChange }: InputCorrectNumberProps) {
  const totalFields = Math.max(2, values.length)

  const handleAddField = () => {
    onValuesChange([...values, 0])
  }

  const handleRemoveField = () => {
    if (totalFields > 2) {
      onValuesChange(values.slice(0, -1))
    }
  }

  const handleNumberChange = (index: number, value: string) => {
    const parsed = Number(value)
    const nextValues = [...values]
    nextValues[index] = Number.isFinite(parsed) ? parsed : 0
    onValuesChange(nextValues)
  }

  const normalizedValues = Array.from({ length: totalFields }, (_, index) => values[index] ?? 0)

  return (
    <Field>
      <FieldLabel
        htmlFor="question-type"
        className="text-base flex justify-between"
      >
        <div>Masukkan Bilangan yang dicari</div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleAddField}
            className="w-7 h-7 bg-pink-500 rounded-lg flex items-center justify-center text-white font-bold cursor-pointer hover:bg-pink-600 transition-all duration-300"
          >
            <HugeiconsIcon icon={Add01Icon} size={20} />
          </button>

          <button
            type="button"
            onClick={handleRemoveField}
            disabled={totalFields <= 2}
            className={`
              w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold transition-all duration-300
              ${
                totalFields <= 2
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-pink-500 hover:bg-pink-600 cursor-pointer"
              }
            `}
          >
            <HugeiconsIcon icon={Remove01Icon} size={20} />
          </button>
        </div>
      </FieldLabel>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-gray-200 p-2 rounded-md">
        {normalizedValues.map((numberValue, index) => (
          <div key={index} className="flex gap-3 items-center">
            <div>{index + 1}.</div>

            <Input
              type="number"
              value={numberValue}
              onChange={(event) => handleNumberChange(index, event.target.value)}
              placeholder={`Masukkan bilangan ke-${index + 1}`}
            />
          </div>
        ))}
      </div>

      <FieldDescription>
        Bilangan ini akan digunakan untuk mengoreksi benar atau tidaknya
        jawaban.
      </FieldDescription>
    </Field>
  )
}
