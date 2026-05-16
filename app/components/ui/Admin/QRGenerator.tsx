'use client';

import { ReactQRCode, type ReactQRCodeRef } from "@lglab/react-qr-code";
import { useRef, useState } from "react";
import { toast } from "sonner";

type QRGeneratorProps = {
    link: string;
}

export function QRGenerator({link}: QRGeneratorProps) {
    const ref = useRef<ReactQRCodeRef>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isCopying, setIsCopying] = useState(false)

    const handleDownload = () => {
        setIsLoading(true)
        try {
            if (!ref.current) {
                toast.error("QR belum siap. Coba lagi.")
                return
            }

            ref.current.download({
                name: "qr-jafika",
                format: "png",
                size: 1024,
            })
            toast.success("QR berhasil diunduh (PNG).")
        } catch {
            toast.error("Gagal mengunduh QR.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleCopyLink = async () => {
        setIsCopying(true)
        try {
            await navigator.clipboard.writeText(link)
            toast.success("Link berhasil disalin ke clipboard.")
        } catch {
            toast.error("Gagal menyalin link.")
        } finally {
            setIsCopying(false)
        }
    }
    
    return (
        <div className="flex flex-col justify-center items-center">
            <ReactQRCode
                ref={ref}
                value={link}
                size={250}
            />
            <button 
                className="py-2 w-full m-auto bg-pink-400 text-white text-sm rounded-sm cursor-pointer"
                onClick={handleDownload}
            >
                {isLoading ? 'Downloading...' : 'Download QR'}
            </button>
            <button 
                className="py-2 mt-2 w-full m-auto bg-pink-400 text-white text-sm rounded-sm cursor-pointer"
                onClick={handleCopyLink}
            >
                {isCopying ? 'Copying...' : 'Copy Link'}
            </button>
        </div>
    )
}
