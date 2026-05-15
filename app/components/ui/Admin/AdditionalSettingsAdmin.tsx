"use client"

import { useState } from "react"

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field"
import { Switch } from "@/components/ui/switch"

export function AdditionalSettingsAdmin() {
  const [totalFields, setTotalFields] = useState(2)

  const handleAddField = () => {
    setTotalFields((prev) => prev + 1)
  }

  const handleRemoveField = () => {
    if (totalFields > 2) {
      setTotalFields((prev) => prev - 1)
    }
  }

  return (
    <Field>
      <FieldLabel
        htmlFor="question-type"
        className="text-base flex justify-between"
      >
        <div>Settings tambahan</div>

        
      </FieldLabel>

      <div className="border border-gray-200 p-2 rounded-md space-y-2">
        <FieldGroup>
            <FieldLabel htmlFor="public-access">
            <Field orientation="horizontal">
                <FieldContent>
                    <FieldTitle>Publik Akses</FieldTitle>
                    <FieldDescription>
                    Semua orang yang memiliki link bisa mengakses soal Anda.
                    </FieldDescription>
                </FieldContent>
                <Switch id="public-access" defaultChecked/>
            </Field>
        </FieldLabel>
        </FieldGroup>
        <FieldGroup>
            <FieldLabel htmlFor="3d-assistant">
            <Field orientation="horizontal">
                <FieldContent>
                    <FieldTitle>3D Assistant</FieldTitle>
                    <FieldDescription>
                    Munculkan 3D Assistant untuk membantu memecahkan masalah.
                    </FieldDescription>
                </FieldContent>
                <Switch id="3d-assistant" defaultChecked/>
            </Field>
        </FieldLabel>
        </FieldGroup>
      </div>

      <FieldDescription>
        Sesuaikan settings tambahan untuk soal yang akan dibuat.
      </FieldDescription>
    </Field>
  )
}