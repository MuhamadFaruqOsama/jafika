import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar"
import Image from "next/image"
import { LinkAppSidebar } from "./LinkAppSidebar"
import { BookBookmark02Icon, Clock02Icon, Home07Icon, Logout02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

const SIDEBAR_LINKS = [
  {
    href: "/",
    label: "home",
    icon: <HugeiconsIcon icon={Home07Icon} />,
    type: "regular",
  },
  {
    href: "/soal",
    label: "soal",
    icon: <HugeiconsIcon icon={BookBookmark02Icon} />,
    type: "regular",
  },
  {
    href: "/soal/history",
    label: "history",
    icon: <HugeiconsIcon icon={Clock02Icon} />,
    type: "regular",
  }
]

export function AppSidebar() {
  return (
    <Sidebar
      className="border-e border-gray-200"
    >
      <SidebarHeader>
        <div className="flex justify-center -m-3">
          <Image
            src="/icon/logo.png"
            alt="JAFIKA"
            width={150}
            height={150}
            className="-mb-14"
          />
        </div>
      </SidebarHeader>
      <SidebarContent className="mt-14 border-t border-gray-200">
        <SidebarGroup>
          <div className="space-y-2">
            {
              SIDEBAR_LINKS.map((link) => (
                <LinkAppSidebar
                  key={link.href}
                  href={link.href}
                  label={link.label}
                  icon={link.icon}
                  type={link.type}
                />
              ))
            }
          </div>
        </SidebarGroup>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter>
        <LinkAppSidebar
          href="/logout"
          label="Logout"
          icon={<HugeiconsIcon icon={Logout02Icon} />}
          type="danger"
        />
      </SidebarFooter>
    </Sidebar>
  )
}