import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "../../components/ui/AppSidebar";


export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <SidebarProvider>
        <AppSidebar />
        <main className="flex-1 min-w-0 bg-gray-50">
            <SidebarTrigger className="ps-4 pt-4"/>
            <div className="px-4 pt-4">
                {children}
            </div>
        </main>
        </SidebarProvider>
    )
}
