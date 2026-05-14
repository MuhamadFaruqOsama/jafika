import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

type InputAdminProps = {
    label: string;
    id: string;
    type: string;
    placeholder: string;
    description: string;
}

export function InputAdmin({ label, id, type, placeholder, description }: InputAdminProps) {
  return (
    <Field>
      <FieldLabel htmlFor={id} className="text-base">{label}</FieldLabel>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
      />
      <FieldDescription>
        {description}
      </FieldDescription>
    </Field>
  )
}
