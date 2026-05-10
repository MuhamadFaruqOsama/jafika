import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "../components/ui/AppSidebar";


export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <SidebarProvider>
        <AppSidebar />
        <main>
            <SidebarTrigger />
            {children}
        </main>
        </SidebarProvider>
    )
}