import { DocumentValidationIcon, LinkForwardIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

export function LastQuestionCardAdmin() {
    return (
        <div className="border border-gray-200 w-full rounded-lg p-3 transition-all duration-150 hover:shadow-md">
            <div className="flex items-end gap-3">
                <div className="w-14 h-14 bg-blue-400 rounded-md flex items-center justify-center text-white">
                    <HugeiconsIcon icon={DocumentValidationIcon} size={36} strokeWidth={2}/>
                </div>
                <div className="text-black text-lg">Soal terakhir dibuat</div>
            </div>
            <div className="border-t border-gray-200 mt-4 pt-4 text-gray-600 space-y-3">
                <div className="flex justify-between items-center">
                    <span>Soal dibuat pada</span>
                    <span>12 Jun 2026</span>
                </div>
                <div className="flex justify-between items-center">
                    <span>Dikerjakan oleh</span>
                    <span>12 murid</span>
                </div>
            </div>
            <div className="border-t border-gray-200 mt-4 pt-4">
                <Link
                    href={'soal/history'}
                    className="flex items-center justify-center gap-2 bg-blue-400 rounded-md py-2 text-white"
                >
                    Pantau
                    <HugeiconsIcon icon={LinkForwardIcon} />
                </Link>
            </div>
        </div>
    )
}