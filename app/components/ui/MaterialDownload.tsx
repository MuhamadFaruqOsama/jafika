import { Pdf02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

type MaterialDownloadProps = {
    materialPath: string | null
}

function getFileName(materialPath: string) {
    const rawFileName = materialPath.split("/").pop() ?? "materi.pdf"
    return decodeURIComponent(rawFileName)
}

export function MaterialDownload({ materialPath }: MaterialDownloadProps) {
    if (!materialPath) {
        return (
            <div className="w-full flex gap-3 bg-gray-50 border border-gray-200 items-center rounded-lg p-2 opacity-80">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-400 text-white">
                    <HugeiconsIcon icon={Pdf02Icon} size={22}/>
                </div>
                <div className="flex flex-col items-start">
                    <div className="text-black font-medium">
                        Materi belum tersedia
                    </div>
                    <div className="text-sm text-gray-500">Belum ada file PDF</div>
                </div>
            </div>
        )
    }

    const fileName = getFileName(materialPath)

    return (
        <a
            href={materialPath}
            download
            target="_blank"
            rel="noreferrer"
            className="w-full flex gap-3 bg-white border border-gray-200 items-center rounded-lg p-2 cursor-pointer hover:bg-gray-100 transition-all duration-300"
        >
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-red-500 text-white">
                <HugeiconsIcon icon={Pdf02Icon} size={22}/>
            </div>
            <div className="flex flex-col items-start">
                <div className="text-black font-medium">
                    Klik untuk mendownload Materi
                </div>
                <div className="text-sm text-gray-500 line-clamp-2">{fileName}</div>
            </div>
        </a>
    )
}
