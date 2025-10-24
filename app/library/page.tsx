import companies from '@/data/companies.json';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function LibraryPage(){
  const total = (companies as any[]).length;

  // Agrupar por categoria (sem Object.groupBy)
  const byCat = (companies as any[]).reduce((acc: Record<string, any[]>, c: any) => {
    (acc[c.category] ||= []).push(c);
    return acc;
  }, {});

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader><h2 className="text-lg font-semibold">Biblioteca de Empresas ({total}+)</h2></CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {Object.entries(byCat).map(([cat, list]) => (
              <div key={cat} className="card p-3">
                <div className="font-medium mb-2">{cat}</div>
                <ul className="space-y-1 text-sm">
                  {(list as any[]).slice(0, 30).map((c: any) => (
                    <li key={c.id}>{c.name}</li>
                  ))}
                </ul>
                <div className="text-xs text-neutral-600 mt-2">…e mais.</div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm text-neutral-600">
            Lista local com empresas de Biomed, Tech e Consulting. Sem chamadas externas.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}



