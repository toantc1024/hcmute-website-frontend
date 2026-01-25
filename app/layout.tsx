import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/layout/auth";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "HCMUTE - Trường Đại học Sư phạm Kỹ thuật TP.HCM",
  description: "Website chính thức của Trường Đại học Sư phạm Kỹ thuật TP.HCM",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.3.2/css/flag-icons.min.css"
        />
        <link rel="preconnect" href="https://rsms.me/" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </head>
      <body className="antialiased">
        <AuthProvider>{children}</AuthProvider>
        <Toaster position="bottom-right" richColors closeButton />
      </body>
    </html>
  );
}
