import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"

type InputAdminProps = {
    label: string;
    id: string;
    placeholder: string;
    description: string;
    value?: string;
    onValueChange?: (value: string) => void;
}

export function TextAreaAdmin({
  label,
  id,
  placeholder,
  description,
  value,
  onValueChange,
}: InputAdminProps) {
  return (
    <Field>
      <FieldLabel htmlFor={id} className="text-base">{label}</FieldLabel>
      <Textarea
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onValueChange?.(event.target.value)}
      />
      <FieldDescription>{description}</FieldDescription>
    </Field>
  )
}
