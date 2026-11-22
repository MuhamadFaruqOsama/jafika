import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"

type QuestionTypeAdminProps = {
  kpkMode: boolean
  fpbMode: boolean
  pemfaktoranMode: boolean
  onKpkModeChange: (checked: boolean) => void
  onFpbModeChange: (checked: boolean) => void
  onPemfaktoranModeChange: (checked: boolean) => void
}

export function QuestionTypeAdmin({
  kpkMode,
  fpbMode,
  pemfaktoranMode,
  onKpkModeChange,
  onFpbModeChange,
  onPemfaktoranModeChange,
}: QuestionTypeAdminProps) {
  return (
    <Field>
        <FieldLabel htmlFor="question-type" className="text-base">
            Jenis Soal
        </FieldLabel>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border border-gray-200 p-2 rounded-md">
            <FieldGroup>
              <Field orientation="horizontal">
                <Checkbox
                  id="kpk-mode-checkbox"
                  name="kpk-mode-checkbox"
                  checked={kpkMode}
                  onCheckedChange={(checked) => onKpkModeChange(checked === true)}
                />
                <FieldContent>
                  <FieldLabel htmlFor="kpk-mode-checkbox">
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
                  id="fpb-mode-checkbox"
                  name="fpb-mode-checkbox"
                  checked={fpbMode}
                  onCheckedChange={(checked) => onFpbModeChange(checked === true)}
                />
                <FieldContent>
                  <FieldLabel htmlFor="fpb-mode-checkbox">
                    FPB
                  </FieldLabel>
                  <FieldDescription>
                    Faktor Persekutuan Terbesar.
                  </FieldDescription>
                </FieldContent>
              </Field>
            </FieldGroup>
            <FieldGroup>
              <Field orientation="horizontal">
                <Checkbox
                  id="pemfaktoran-mode-checkbox"
                  name="pemfaktoran-mode-checkbox"
                  checked={pemfaktoranMode}
                  onCheckedChange={(checked) => onPemfaktoranModeChange(checked === true)}
                />
                <FieldContent>
                  <FieldLabel htmlFor="pemfaktoran-mode-checkbox">
                    Pemfaktoran
                  </FieldLabel>
                  <FieldDescription>
                    Faktorisasi prima 1 bilangan.
                  </FieldDescription>
                </FieldContent>
              </Field>
            </FieldGroup>
        </div>
        <FieldDescription>
            Pilih jenis soal yang ingin Anda buat. Anda bisa memilih KPK, FPB, atau Pemfaktoran murni.
        </FieldDescription>
    </Field>
  )
}
