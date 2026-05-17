import { DocumentValidationIcon, LinkForwardIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

type LastQuestionCardAdminProps = {
    latestCreatedAtLabel: string;
    latestQuestionWorkedBy: number;
    latestQuestionUuid?: string | null;
}

export function LastQuestionCardAdmin({
    latestCreatedAtLabel,
    latestQuestionWorkedBy,
    latestQuestionUuid,
}: LastQuestionCardAdminProps) {
    const latestQuestionHref = latestQuestionUuid
      ? `/studio/soal/detail?uuid=${latestQuestionUuid}`
      : "/studio/soal";

    return (
        <div className="bg-white border border-gray-200 w-full rounded-lg p-3 transition-all duration-150 hover:shadow-md">
            <div className="flex items-end gap-3">
                <div className="w-14 h-14 bg-blue-400 rounded-md flex items-center justify-center text-white">
                    <HugeiconsIcon icon={DocumentValidationIcon} size={36} strokeWidth={2}/>
                </div>
                <div className="text-black text-lg">Soal terakhir dibuat</div>
            </div>
            <div className="border-t border-gray-200 mt-4 pt-4 text-gray-600 space-y-3">
                <div className="flex justify-between items-center">
                    <span>Soal dibuat pada</span>
                    <span>{latestCreatedAtLabel}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span>Dikerjakan oleh</span>
                    <span>{latestQuestionWorkedBy} murid</span>
                </div>
            </div>
            <div className="border-t border-gray-200 mt-4 pt-4">
                <Link
                    href={latestQuestionHref}
                    prefetch={false}
                    className="flex items-center justify-center gap-2 bg-blue-400 rounded-md py-2 text-white"
                >
                    Pantau
                    <HugeiconsIcon icon={LinkForwardIcon} />
                </Link>
            </div>
        </div>
    )
}
