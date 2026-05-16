import { Pdf02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export function MaterialDownload() {
    return (
        <button className="w-full flex gap-3 bg-white border border-gray-200 items-center rounded-lg p-2 cursor-pointer hover:bg-gray-100 transition-all duration-300">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-red-500 text-white">
                <HugeiconsIcon icon={Pdf02Icon} size={22}/>
            </div>
            <div className="flex flex-col items-start">
                <div className="text-black font-medium">
                    Klik untuk mendownload Materi
                </div>
                <div className="text-sm text-gray-500">nama_file.pdf</div>
            </div>
        </button>
    )
}