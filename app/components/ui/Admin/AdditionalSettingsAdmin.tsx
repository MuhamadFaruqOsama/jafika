"use client"

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field"
import { Switch } from "@/components/ui/switch"

type AdditionalSettingsAdminProps = {
  publicAccess: boolean
  assistant3d: boolean
  onPublicAccessChange: (checked: boolean) => void
  onAssistant3dChange: (checked: boolean) => void
}

export function AdditionalSettingsAdmin({
  publicAccess,
  assistant3d,
  onPublicAccessChange,
  onAssistant3dChange,
}: AdditionalSettingsAdminProps) {

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
                <Switch
                  id="public-access"
                  checked={publicAccess}
                  onCheckedChange={onPublicAccessChange}
                />
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
                <Switch
                  id="3d-assistant"
                  checked={assistant3d}
                  onCheckedChange={onAssistant3dChange}
                />
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
