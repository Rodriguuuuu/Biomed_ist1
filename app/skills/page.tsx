'use client';
import { COURSES } from '@/data/courses';
import { useGrades } from '@/lib/state';
import { courseSkillWeights, gradeStrength, SKILLS } from '@/lib/skills';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { RadarChart } from '@/components/radar';

type Thresholds = { strong:number; solid:number; base:number };

export default function SkillsPage(){
  const { grades } = useGrades();
  const thresholds:Thresholds = { strong:16, solid:14, base:12 };

  const { scores, norm } = (()=>{
    const totals: Record<string, number> = {};
    let ectsWithGrades = 0;
    for (const c of COURSES){
      const g = grades[c.name];
      if (typeof g !== 'number') continue;
      ectsWithGrades += c.ects;
      const w = courseSkillWeights(c.name);
      const s = gradeStrength(g);
      for (const [k, val] of Object.entries(w)){
        totals[k] = (totals[k]||0) + s * c.ects * (val as number);
      }
    }
    const norm = Object.fromEntries(SKILLS.map(k=>[k, (totals[k]||0)/(ectsWithGrades||1)]));
    return { scores: totals, norm };
  })();

  const labels = Array.from(SKILLS);
  const values = labels.map(l=>norm[l]||0);

  const list = labels.map(l=>({k:l, v: (norm[l]||0)})).sort((a,b)=>b.v-a.v);

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader><h2 className="text-lg font-semibold">Perfil de competências</h2></CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-center justify-center">
              <RadarChart labels={labels as string[]} values={values} />
            </div>
            <div>
              <ul className="space-y-2">
                {list.map(({k,v})=>(
                  <li key={k} className="flex items-center justify-between">
                    <span>{k}</span>
                    <span className="badge">{v.toFixed(3)}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-neutral-600">Força (≥16), Sólido (≥14), Base (≥12) são limiares configuráveis.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
