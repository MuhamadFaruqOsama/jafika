import { Login02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

type HeaderAuthProps = {
    title: string;
    description: string;
}

export function HeaderAuth({ title, description }: HeaderAuthProps) {
    return (
        <div className="mb-5 text-start border-b border-gray-200 pb-5">
            <div className="flex items-center gap-3">
                <HugeiconsIcon icon={Login02Icon} size={40} strokeWidth={3} className="text-pink-500/60"/>
                <div className="text-3xl font-bold text-pink-500 bubble-font">{title}</div>
            </div>
            <div className="text-sm text-gray-500 mt-2">{description}</div>
        </div>
    )
}