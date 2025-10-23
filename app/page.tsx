import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";

export default function Page(){
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader><h1 className="text-xl font-semibold">Engenharia Biomédica IST — GPA & Matches</h1></CardHeader>
        <CardContent>
          <p>Aplicação local-first em PT/EN. Introduz apenas as tuas notas nas UCs; calculamos o GPA ECTS, perfil de competências e ranking de empregadores.</p>
          <ul className="mt-4 list-disc pl-6 text-sm">
            <li>Sem chamadas externas • Todos os dados ficam no teu navegador.</li>
            <li>Acessibilidade WCAG 2.2 AA (HTML semântico, estados de foco, skip link).</li>
            <li>Publica com proteção por Basic Auth (middleware + variáveis de ambiente).</li>
          </ul>
          <div className="mt-4 flex gap-3">
            <Link href="/grades" className="btn">Começar nas Notas</Link>
            <Link href="/about" className="btn">Sobre/Privacidade</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
