import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { AuthSessionExpiredPopup } from "@/components/auth/AuthSessionExpiredPopup";
import { AlertProvider } from "@/components/ui/AlertProvider";
import { ThemeRouteSync } from "@/components/theme/ThemeRouteSync";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "AI Chatbot System for Tenants",
    template: "%s | AI Chatbot System",
  },
  description:
    "Hệ thống chatbot AI đa tenant cho tài liệu nội bộ, chính sách và tra cứu tri thức. / Multi-tenant AI chatbot for internal documents and knowledge.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  var saved = localStorage.getItem("theme");
                  var theme = saved === "light" || saved === "dark"
                    ? saved
                    : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
                  document.documentElement.classList.remove("light", "dark");
                  document.documentElement.classList.add(theme);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AlertProvider>
          <ThemeRouteSync />
          <AuthSessionExpiredPopup />
          <AuthGuard>{children}</AuthGuard>
        </AlertProvider>
      </body>
    </html>
  );
}
