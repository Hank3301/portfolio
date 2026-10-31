import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Henrique Costa | Desenvolvedor Full-Stack",
  description: "Portfólio profissional de Henrique Costa — Desenvolvedor Full-Stack especializado em React, Next.js, Python, FastAPI e arquitetura cloud.",
  keywords: ["desenvolvedor", "full-stack", "portfolio", "react", "nextjs", "python", "fastapi", "henrique costa"],
  authors: [{ name: "Henrique Costa" }],
  openGraph: {
    title: "Henrique Costa | Desenvolvedor Full-Stack",
    description: "Portfólio profissional de Henrique Costa — Desenvolvedor Full-Stack.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#09090b", // zinc-950
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100">
        <Navbar />
        <main className="flex-1 pt-16">{children}</main>
        <footer className="border-t border-zinc-800 py-8">
          <div className="mx-auto max-w-7xl px-4 text-center text-sm text-zinc-500">
            © {new Date().getFullYear()} Henrique Costa. Todos os direitos reservados.
          </div>
        </footer>
      </body>
    </html>
  );
}