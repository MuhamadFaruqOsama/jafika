'use client';

import { ReactQRCode, type ReactQRCodeRef } from "@lglab/react-qr-code";
import { useRef, useState } from "react";

type QRGeneratorProps = {
    link: string;
}

export function QRGenerator({link}: QRGeneratorProps) {
    const ref = useRef<ReactQRCodeRef>(null)
    const [isLoading, setIsLoading] = useState(false)

    const handleDownload = () => {
        setIsLoading(true)
        ref.current?.download({
            name: 'QR JAFIKA download',
            format: 'png',
            size: 1000,
        })
        setIsLoading(false)
    }
    
    return (
        <div className="flex flex-col justify-center items-center">
            <ReactQRCode
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
                onClick={handleDownload}
            >
                Copy Link
            </button>
        </div>
    )
}