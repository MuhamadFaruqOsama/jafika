import Link from "next/link";

type LinkAppSidebarProps = {
    href: string;
    label: string;
    icon: React.ReactNode;
    type: String;
}

export function LinkAppSidebar({ href, label, icon, type}: LinkAppSidebarProps) {
    return (
        <Link 
            href={href}
            className={'capitalize flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-300 ' + (type === 'regular' ? 'hover:bg-gray-100' : 'hover:bg-red-100 text-red-500')}
        >
            {icon}
            {label}
        </Link>
    )
}