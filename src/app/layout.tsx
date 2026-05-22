import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Panel de Control de Perfumes - Inventario y Precios",
  description:
    "Gestiona precios mayoristas, calcula margenes sugeridos y exporta directamente a Excel. Panel de control profesional de inventario de perfumes.",
  keywords: [
    "perfumes",
    "inventario",
    "precios",
    "mayorista",
    "control",
    "panel",
  ],
  authors: [{ name: "Perfume Inventory" }],
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 text-slate-800 min-h-screen`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
