import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"
import { ReactNode } from "react"

type AlertProps = {
    title: string;
    description: ReactNode;
}

export function Notification({title, description}: AlertProps) {
    return (
        <Alert>
            <InfoIcon />
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription>
                {description}
            </AlertDescription>
        </Alert>
    )
}
