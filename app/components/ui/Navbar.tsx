"use client";

import Image from "next/image";
import Button from "./Button";
import { HugeiconsIcon } from '@hugeicons/react'
import { Settings01Icon } from "@hugeicons/core-free-icons";

type NavbarProps = {
  onOpenSettings: () => void;
};

export function Navbar({ onOpenSettings }: NavbarProps) {
  return (
    <nav className="relative flex max-h-[10vh] w-full items-center justify-center bg-pink-500 border-b border-gray-200">
      <Image 
        src="/icon/logo.png" 
        alt="JAFIKA" 
        width={250}
        height={250}
        className="-mb-14"
        />
      <div className="absolute right-3 md:right-6">
        <div className="flex justify-end gap-3">
          <Button variant="main" onClick={onOpenSettings}>
            <HugeiconsIcon icon={Settings01Icon} size={20} strokeWidth={3}/>
            <span className="hidden md:block">Settings</span>
          </Button>
        </div>
      </div>
    </nav>
  );
}
