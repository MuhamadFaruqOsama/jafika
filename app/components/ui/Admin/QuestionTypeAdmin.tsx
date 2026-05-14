import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"

export function QuestionTypeAdmin() {
  return (
    <Field>
        <FieldLabel htmlFor="question-type" className="text-base">
            Jenis Soal
        </FieldLabel>
        <div className="grid grid-cols-2 gap-4 border border-gray-200 p-2 rounded-md">
            <FieldGroup>
              <Field orientation="horizontal">
                <Checkbox
                  id="terms-checkbox-desc"
                  name="terms-checkbox-desc"
                  defaultChecked
                />
                <FieldContent>
                  <FieldLabel htmlFor="terms-checkbox-desc">
                    KPK
                  </FieldLabel>
                  <FieldDescription>
                    Kelipatan Persekutuan Terkecil.
                  </FieldDescription>
                </FieldContent>
              </Field>
            </FieldGroup>
            <FieldGroup>
              <Field orientation="horizontal">
                <Checkbox
                  id="terms-checkbox-desc"
                  name="terms-checkbox-desc"
                  defaultChecked
                />
                <FieldContent>
                  <FieldLabel htmlFor="terms-checkbox-desc">
                    FPB
                  </FieldLabel>
                  <FieldDescription>
                    Faktor Persekutuan Terbesar.
                  </FieldDescription>
                </FieldContent>
              </Field>
            </FieldGroup>
        </div>
        <FieldDescription>
            Pilih jenis soal yang ingin Anda buat. Anda bisa memilih 1 jenis atau lebih.
        </FieldDescription>
    </Field>
  )
}