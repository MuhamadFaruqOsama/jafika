import { AdminTable } from "@/app/components/ui/Admin/AdminTable";
import { QRGenerator } from "@/app/components/ui/Admin/QRGenerator";
import { UserIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export default function RootLayout() {
    return (
        <div className="mt-5 pb-20">
            <div className="grid grid-cols-4 gap-4">
                <div className="col-span-3 bg-white p-3 border border-gray-200 rounded-md">
                    <div className="bg-pink-400 text-white rounded-full py-1 px-5 w-fit font-medium text-sm mb-5">Detail Soal</div>
                    <h1 className="text-xl font-medium">Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim, dolores!</h1>
                    <p className="mt-2 text-gray-700">Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt modi odio dignissimos delectus suscipit ab, excepturi adipisci, provident temporibus id hic et, iure nobis voluptatum molestiae harum a! Necessitatibus, atque.</p>
                </div>
                <div className="col-span-1 bg-white p-3 border border-gray-200 rounded-md">
                    <QRGenerator
                        link="cek"
                    />
                </div>
            </div>
            <div className="bg-white border border-gray-200 p-3 rounded-md mt-3">
                <div className="bg-pink-400 text-white rounded-full py-1 px-5 w-fit font-medium text-sm mb-5">Riwayat Pengerjaan Soal</div>

                <div className="grid grid-cols-3 gap-3 mb-5">

                    {/* total yang mngerjakan */}
                    <div className="w-full border border-gray-200 p-3 rounded-md flex justify-between">
                        <div className="w-10 h-10 rounded-full bg-blue-400 text-white flex items-center justify-center">
                            <HugeiconsIcon icon={UserIcon} size={25}/>
                        </div>

                        <div className="flex justify-end items-end flex-col">
                            <div className="text-2xl font-medium">80</div>
                            <div className="text-sm text-gray-500 line-clamp-1">Total yang mengerjakan</div>
                        </div>
                    </div>

                    {/* total yang sudah selesai */}
                    <div className="w-full border border-gray-200 p-3 rounded-md flex justify-between">
                        <div className="w-10 h-10 rounded-full bg-green-400 text-white flex items-center justify-center">
                            <HugeiconsIcon icon={UserIcon} size={25}/>
                        </div>

                        <div className="flex justify-end items-end flex-col">
                            <div className="text-2xl font-medium">70</div>
                            <div className="text-sm text-gray-500 line-clamp-1">Total yang sudah selesai</div>
                        </div>
                    </div>

                    {/* total yang belum selesai */}
                    <div className="w-full border border-gray-200 p-3 rounded-md flex justify-between">
                        <div className="w-10 h-10 rounded-full bg-orange-400 text-white flex items-center justify-center">
                            <HugeiconsIcon icon={UserIcon} size={25}/>
                        </div>

                        <div className="flex justify-end items-end flex-col">
                            <div className="text-2xl font-medium">10</div>
                            <div className="text-sm text-gray-500 line-clamp-1">Total yang belum selesai</div>
                        </div>
                    </div>

                </div>
                
                <AdminTable/>
            </div>
        </div>
    )
}
