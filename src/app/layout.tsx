import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import PageTransition from "@/components/layout/PageTransition";
import { AuthProvider } from "@/lib/auth-context";

export const metadata: Metadata = {
  title: "Dibiyapur Live — Apna Digital Shahar",
  description:
    "Dibiyapur Ka Apna Hyper-Local Digital Hub. Business directory, community feed, second-hand marketplace & creator hub for Dibiyapur, District Auraiya.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Dibiyapur Live",
  },
};

export const viewport: Viewport = {
  themeColor: "#f97316",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hi" className="h-full">
      <body className="h-full bg-slate-50 antialiased">
        <AuthProvider>
          <Header />
          <main className="min-h-[calc(100vh-4rem)] pb-20 md:pb-8">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <PageTransition>{children}</PageTransition>
            </div>
          </main>
          <BottomNav />
        </AuthProvider>
      </body>
    </html>
  );
}
