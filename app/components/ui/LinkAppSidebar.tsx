'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";

type LinkAppSidebarProps = {
    href: string;
    label: string;
    icon: React.ReactNode;
    type: "regular" | "danger";
}

export function LinkAppSidebar({ href, label, icon, type}: LinkAppSidebarProps) {
    const pathname          = usePathname();
    const normalizePath     = (path: string) => path.replace(/\/+$/, "") || "/";

    const currentPath       = normalizePath(pathname);
    const targetPath        = normalizePath(href);
    
    const targetDepth       = targetPath.split("/").filter(Boolean).length;
    const isTopLevelTarget  = targetDepth <= 1;

    const isActive =
      currentPath === targetPath ||
      (!isTopLevelTarget && targetPath !== "/" && currentPath.startsWith(`${targetPath}/`));

    const baseClass =
      "capitalize flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-300";

    const variantClass =
      type === "regular" ? "text-gray-700 hover:bg-gray-100" : "text-red-500 hover:bg-red-100";

    const activeClass = type === "regular" ? "bg-pink-500 text-white hover:bg-pink-500" : "bg-red-500 text-white hover:bg-red-500";
    
    return (
        <Link 
            href={href}
            prefetch={false}
            className={`${baseClass} ${isActive ? activeClass : variantClass}`}
        >
            {icon}
            {label}
        </Link>
    )
}
