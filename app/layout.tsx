import "./globals.css";
import type { Metadata } from "next";
import { D } from "@/lib/i18n";
import Link from "next/link";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "IST BME — GPA & Matches",
  description: "Local-first GPA, skills & employer matching for IST Biomedical Engineering.",
};

export default function RootLayout({children}:{children:ReactNode}){
  return (
    <html lang="pt">
      <body>
        <a href="#conteudo" className="skip-link">Ir para conteúdo</a>
        <header className="border-b">
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

function LangToggle(){
  // For simplicity we just switch the html lang attribute and store preference.
  // In a fuller app you'd wrap strings; here copy keeps PT as default with English in sections.
  return <a href="#" onClick={(e)=>{e.preventDefault(); const html=document.documentElement; html.lang = html.lang==='pt'?'en':'pt';}} className="btn" aria-label="Alternar idioma">PT/EN</a>
}
