import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "../../components/ui/AppSidebar";
import { createClient } from "@/lib/server";
import { redirect } from "next/navigation";


export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const supabase = await createClient();
    const { data } = await supabase.auth.getClaims();
    const userId = data?.claims?.claims?.sub;

    if (!userId) {
        redirect("/login");
    }

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
