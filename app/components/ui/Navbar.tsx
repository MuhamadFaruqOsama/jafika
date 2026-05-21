"use client";

import Image from "next/image";
import Button from "./Button";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft03Icon, Login02Icon, Settings01Icon } from "@hugeicons/core-free-icons";
import { usePathname } from "next/navigation";
import Link from "next/link";

type NavbarProps = {
  onOpenSettings?: () => void;
  hideLoginButton?: boolean;
  hideAuthAction?: boolean;
};

export function Navbar({ onOpenSettings, hideLoginButton, hideAuthAction = false }: NavbarProps) {
  const pathname = usePathname();
  const isAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register");
  const shouldHideLogin = hideLoginButton ?? isAuthPage;

  return (
    <nav className="relative flex max-h-[10vh] w-full items-center justify-start md:justify-center bg-pink-500 border-b border-gray-200">
      <Image
        src="/icon/logo.png"
        alt="JAFIKA"
        width={250}
        height={250}  
        className="-mb-14 w-50 md:w-62.5"
      />
      <div className="absolute right-3 md:right-6">
        <div className="flex justify-end gap-3">
          {onOpenSettings && (
            <Button variant="main" onClick={onOpenSettings}>
              <HugeiconsIcon icon={Settings01Icon} size={20} strokeWidth={3} />
              <span className="hidden md:block">Settings</span>
            </Button>
          )}
          {!hideAuthAction && !shouldHideLogin && (
            <Link className="main-button" href="/login">
              <HugeiconsIcon icon={Login02Icon} size={20} strokeWidth={3} />
              <span className="hidden md:block">Login</span>
            </Link>
          )}
          {!hideAuthAction && shouldHideLogin && (
            <Link className="main-button" href="/">
              <HugeiconsIcon icon={ArrowLeft03Icon} size={20} strokeWidth={3} />
              <span className="hidden md:block">Back</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
