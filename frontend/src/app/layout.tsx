import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hugo Costa de Souza | Desenvolvedor Full-Stack",
  description: "Portfólio profissional de Hugo Costa de Souza — Desenvolvedor Full-Stack especializado em React, Next.js, Python, FastAPI e arquitetura cloud.",
  keywords: ["desenvolvedor", "full-stack", "portfolio", "react", "nextjs", "python", "fastapi", "hugo costa de souza"],
  authors: [{ name: "Hugo Costa de Souza" }],
  openGraph: {
    title: "Hugo Costa de Souza | Desenvolvedor Full-Stack",
    description: "Portfólio profissional de Hugo Costa de Souza — Desenvolvedor Full-Stack.",
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
    <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100">
        <SmoothScrollProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            <main className="flex-1 pt-16">{children}</main>
            <footer className="border-t border-zinc-800 py-8">
              <div className="mx-auto max-w-7xl px-4 text-center text-sm text-zinc-500">
                © {new Date().getFullYear()} Hugo Costa de Souza. Todos os direitos reservados.
              </div>
            </footer>
          </ThemeProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}