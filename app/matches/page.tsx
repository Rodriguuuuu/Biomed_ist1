'use client';
import { useMemo, useState } from 'react';
import companies from '@/data/companies.json';
import { SKILLS, courseSkillWeights, gradeStrength } from '@/lib/skills';
import { COURSES } from '@/data/courses';
import { useGrades, cosineSimilarity } from '@/lib/state';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

type Company = typeof companies[number];

function skillVecFromCompany(c:Company){
  // Lightweight defaults by category
  const map: Record<string, Partial<Record<typeof SKILLS[number], number>>> = {
    "Biomed": { "Biomedical Electronics & Instrumentation":0.18,"Signal Processing":0.14,"Imaging":0.14,"Statistics/Data Science":0.10,"Programming":0.06,"Chemistry/Analytical":0.10,"Systems Biology & Physiology":0.12,"Management/HASS":0.06,"Health Economics/Value":0.10 },
    "Tech":   { "Programming":0.18,"Algorithms & Modelling":0.12,"Statistics/Data Science":0.10,"Signal Processing":0.10,"Physics":0.10,"Mathematics":0.10,"Management/HASS":0.08,"Imaging":0.06,"Mechanics/Biomechanics":0.06,"Biomedical Electronics & Instrumentation":0.10 },
    "Consulting": { "Management/HASS":0.30,"Statistics/Data Science":0.10,"Health Economics/Value":0.16,"Programming":0.08,"Algorithms & Modelling":0.12,"Communication":0.24 as any }
  };
  const base = map[c.category] || {};
  const vec = SKILLS.map(s=> (base as any)[s] || 0);
  // normalize
  const sum = vec.reduce((a,b)=>a+b,0) || 1;
  return vec.map(v=>v/sum);
}

function userSkillVec(grades:Record<string,number|undefined>){
  const totals: Record<string, number> = {};
  let ects = 0;
  for (const c of COURSES){
    const g = grades[c.name];
    if (typeof g !== 'number') continue;
    ects += c.ects;
    const w = courseSkillWeights(c.name);
    const s = gradeStrength(g);
    for (const [k,v] of Object.entries(w)){
      totals[k] = (totals[k]||0) + s * c.ects * (v as number);
    }
  }
  const norm = SKILLS.map(k => (totals[k]||0)/(ects||1));
  return norm;
}

export default function MatchesPage(){
  const { grades } = useGrades();
  const [filter,setFilter] = useState<'All'|'Biomed'|'Tech'|'Consulting'>('All');
  const uvec = useMemo(()=>userSkillVec(grades),[grades]);

  const ranked = useMemo(()=>{
    const arr = (companies as Company[]).filter(c=> filter==='All' || c.category===filter).map(c=>{
      const cvec = skillVecFromCompany(c);
      const fit = cosineSimilarity(uvec, cvec);
      return { ...c, score: Math.round(Math.max(0, Math.min(1, fit))*100) };
    }).sort((a,b)=>b.score-a.score);
    return arr.slice(0,50);
  },[uvec, filter]);

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Empresas recomendadas</h2>
          <div className="flex gap-2">
            {(['All','Biomed','Tech','Consulting'] as const).map(k=>(
              <button key={k} className={`btn ${filter===k?'bg-neutral-50':''}`} onClick={()=>setFilter(k)}>{k}</button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <ol className="space-y-2">
            {ranked.map((c,i)=>(
              <li key={c.id} className="card p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-6 text-right">{i+1}.</span>
                  <div>
                    <div className="font-medium">{c.name}</div>
                    <div className="text-xs text-neutral-600">{c.category} • EU/Global</div>
                  </div>
                </div>
                <div className="text-sm"><span className="badge">Score {c.score}</span></div>
              </li>
            ))}
          </ol>
          <p className="mt-3 text-xs text-neutral-600">Ranking baseado em similaridade de competências (cosseno). Ajusta as notas em “Notas & GPA”.</p>
        </CardContent>
      </Card>
    </div>
  );
}
