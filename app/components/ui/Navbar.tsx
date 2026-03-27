"use client";

import Image from "next/image";
import Logo from "@/public/img/logo.png"
import { HugeiconsIcon } from '@hugeicons/react'
import { Clock02Icon, Settings01Icon } from "@hugeicons/core-free-icons";
import Button from "./Button";

export default function Navbar() {
    const handleReset = () => {
        console.log("Mulai dari awal clicked");
    };

    return (
        <nav className="flex items-center justify-center w-full bg-pink-500 shadow-md max-h-[10vh] relative">
            <Image
                src={Logo} 
                alt="" 
                width={200}
                height={200}
                className="-mb-14"/>
            <div className="absolute right-6">
                <div className="flex justify-end gap-3">
                    <Button
                        variant="main"
                        onClick={handleReset}
                    >
                        <HugeiconsIcon 
                            icon={Clock02Icon} 
                            size={20}
                            strokeWidth={2}
                        />
                        <span className="hidden md:block">Mulai Dari Awal</span>
                    </Button>
                    <Button
                        variant="main"
                        data-drawer-target="drawer-settings-funpb"
                        data-drawer-show="drawer-settings-funpb"
                        aria-controls="drawer-settings-funpb">
                        <HugeiconsIcon 
                            icon={Settings01Icon} 
                            size={20}
                            strokeWidth={2}
                        />
                        <span className="hidden md:block">Settings</span>
                    </Button>
                </div>
            </div>
        </nav>
    )
}
