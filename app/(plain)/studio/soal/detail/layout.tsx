'use client'

import { ArrowLeftBigIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "next/navigation";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const router = useRouter()
    
    return (
        <div className="p-4 flex-1 min-w-0 bg-gray-50 min-h-screen">
            <div className="flex items-center justify-start">
                <button 
                    onClick={() => router.back()}
                    className="w-12 h-12 bg-white border text-pink-500 rounded-full border-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-50 duration-300 transition-all">
                    <HugeiconsIcon icon={ArrowLeftBigIcon} />
                </button>
            </div>
            {children}
        </div>
    )
}
