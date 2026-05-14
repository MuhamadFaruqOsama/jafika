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
}

export function TextAreaAdmin({ label, id, placeholder, description }: InputAdminProps) {
  return (
    <Field>
      <FieldLabel htmlFor={id} className="text-base">{label}</FieldLabel>
      <Textarea id={id} placeholder={placeholder}/>
      <FieldDescription>{description}</FieldDescription>
    </Field>
  )
}
