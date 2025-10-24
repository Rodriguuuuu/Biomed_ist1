import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import { ReactNode } from "react";
import LangToggle from "@/components/lang-toggle";

export const metadata: Metadata = {
  title: "IST BME — GPA & Matches",
  description: "Local-first GPA, skills & employer matching for IST Biomedical Engineering.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt">
      <body>
        <a href="#conteudo" className="skip-link">Ir para conteúdo</a>
        <header className="border-b header-grad">
          <nav className="container flex items-center justify-between py-3" aria-label="Principal">
            <div className="font-semibold">IST BME</div>
            <ul className="flex gap-4" role="list">
              <li><Link href="/">Início</Link></li>
              <li><Link href="/grades">Notas & GPA</Link></li>
              <li><Link href="/skills">Competências</Link></li>
              <li><Link href="/matches">Matches</Link></li>
              <li><Link href="/library">Empresas</Link></li>
              <li><Link href="/about">Sobre</Link></li>
            </ul>
            <LangToggle />
          </nav>
        </header>
        <main id="conteudo" className="container py-6">{children}</main>
        <footer className="container py-8 text-sm text-neutral-600">
          <p>Local-first • Sem tracking • © {new Date().getFullYear()}</p>
        </footer>
      </body>
    </html>
  );
}
