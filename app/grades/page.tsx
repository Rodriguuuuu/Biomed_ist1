'use client';
import { COURSES } from '@/data/courses';
import { Input } from '@/components/ui/input';
import { useGrades } from '@/lib/state';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ProgressRing } from '@/components/progress-ring';
import { useMemo } from 'react';

export default function GradesPage(){
  const { grades, update, clear, stats } = useGrades();
  const totalECTS = useMemo(()=> COURSES.reduce((a,c)=>a+c.ects,0),[]);
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader><h2 className="text-lg font-semibold">Notas & GPA</h2></CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2 overflow-x-auto">
              <table className="table" role="grid" aria-label="Tabela de notas">
                <thead><tr><th>UC</th><th>ECTS</th><th>Nota (0–20)</th></tr></thead>
                <tbody>
                  {COURSES.map((c)=>{
                    const v = grades[c.name];
                    const err = v!==undefined && (v<0 || v>20);
                    return (
                      <tr key={c.name}>
                        <td>{c.name}</td>
                        <td>{c.ects}</td>
                        <td>
                          <Input
                            inputMode="decimal"
                            type="number" step="0.1" min={0} max={20}
                            aria-invalid={err||undefined}
                            aria-describedby={err?`${c.name}-err`:undefined}
                            value={v??""}
                            onChange={(e)=>{
                              const val = e.currentTarget.value;
                              update(c.name, val===""? undefined : Number(val));
                            }}
                          />
                          {err && <div id={`${c.name}-err`} className="text-red-600 text-xs mt-1">Valor entre 0 e 20.</div>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="mt-3"><button onClick={clear} className="btn">Limpar notas</button></div>
            </div>
            <div>
              <div className="card p-4 flex flex-col items-center text-center">
                <ProgressRing value={stats.gpa20}/>
                <div className="mt-2">
                  <div className="text-sm text-neutral-600" title="Soma(Nota×ECTS)/Soma(ECTS com nota)">GPA 0–20</div>
                  <div className="text-2xl font-semibold">{stats.gpa20.toFixed(2)}</div>
                  <div className="mt-2 text-sm">0–4: <strong>{stats.gpa4.toFixed(2)}</strong></div>
                  <div className="text-sm">0–100: <strong>{stats.gpa100.toFixed(1)}</strong></div>
                  <div className="mt-2 text-xs text-neutral-600">ECTS considerados: {stats.ectsFilled}</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
