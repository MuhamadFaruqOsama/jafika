"use client";

import Image from "next/image";
import Button from "./Button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Login02Icon, Settings01Icon } from "@hugeicons/core-free-icons";
import { usePathname } from "next/navigation";
import { useRouter } from "next-nprogress-bar";

type NavbarProps = {
  onOpenSettings?: () => void;
  hideLoginButton?: boolean;
};

export function Navbar({ onOpenSettings, hideLoginButton }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/verify-otp");
  const shouldHideLogin = hideLoginButton ?? isAuthPage;

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
          {onOpenSettings && (
            <Button variant="main" onClick={onOpenSettings}>
              <HugeiconsIcon icon={Settings01Icon} size={20} strokeWidth={3} />
              <span className="hidden md:block">Settings</span>
            </Button>
          )}
          {!shouldHideLogin && (
            <Button variant="main" onClick={() => router.push("/login")}>
              <HugeiconsIcon icon={Login02Icon} size={20} strokeWidth={3} />
              <span className="hidden md:block">Login</span>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
