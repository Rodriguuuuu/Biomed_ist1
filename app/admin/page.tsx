'use client';
import { useState } from 'react';
import companies from '@/data/companies.json';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function AdminPage(){
  const [jsonText, setJsonText] = useState(JSON.stringify(companies, null, 2));
  const [msg, setMsg] = useState<string | null>(null);

  const download = () => {
    const blob = new Blob([jsonText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'companies.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader><h2 className="text-lg font-semibold">Admin (privado)</h2></CardHeader>
        <CardContent>
          <p className="text-sm text-neutral-700">Esta página está protegida por HTTP Basic Auth (ver variáveis de ambiente). O site público continua acessível a todos.</p>
          <div className="mt-4">
            <label className="block text-sm font-medium mb-1">companies.json (editar e descarregar para commit)</label>
            <textarea
              className="w-full h-72 border rounded-xl p-2 font-mono text-sm"
              value={jsonText}
              onChange={e=>setJsonText(e.currentTarget.value)}
              aria-label="Editor de JSON"
            />
            <div className="mt-2 flex gap-2">
              <button className="btn" onClick={download}>Descarregar JSON</button>
            </div>
          </div>
          {msg && <p className="mt-2 text-sm">{msg}</p>}
          <p className="mt-6 text-xs text-neutral-600">Nota: Como a app é local-first e estática, alterações globais requerem novo deploy. Usa este editor para preparar o JSON e depois faz commit e deploy.</p>
        </CardContent>
      </Card>
    </div>
  );
}
