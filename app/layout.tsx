import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.hugeicons.com/font/hgi-stroke-rounded.css"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
