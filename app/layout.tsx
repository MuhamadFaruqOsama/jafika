import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from '@vercel/analytics/next';
import { ThemeInitializer } from "@/app/components/ui/ThemeInitializer";
import { ProgressBarProvider } from "@/app/components/ui/ProgressBarProvider";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "JAFIKA",
  description: "JAFIKA with Next.js 16 and TypeScript",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.hugeicons.com/font/hgi-stroke-rounded.css"
        />
      </head>
      <body>
        <ProgressBarProvider>
          <ThemeInitializer />
          {children}
        </ProgressBarProvider>
        <Toaster position="bottom-right" />
        <Analytics />
      </body>
    </html>
  );
}
