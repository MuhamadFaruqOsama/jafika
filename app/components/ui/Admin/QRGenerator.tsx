'use client';

import { ReactQRCode } from "@lglab/react-qr-code";

type QRGeneratorProps = {
    link: string;
}

export function QRGenerator({link}: QRGeneratorProps) {
    return (
        <div className="flex flex-col justify-center items-center">
            <ReactQRCode
                value={link}
                size={250}
            />
            <button className="py-2 px-4 m-auto bg-blue-400 text-white text-sm rounded-sm cursor-pointer">
                Download QR
            </button>
        </div>
    )
}