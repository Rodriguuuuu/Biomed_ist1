'use client';
import { useMemo } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Radar from '@/components/radar';
import { SKILLS, courseSkillWeights, gradeStrength } from '@/lib/skills';
import { COURSES } from '@/data/courses';
import { useGrades } from '@/lib/state';

export default function SkillsPage() {
  const profileId = typeof window !== 'undefined' ? localStorage.getItem('currentProfileId.v1') : null;
  const { grades } = useGrades(profileId);

  // ——— construir vetor de competências a partir das notas ———
  const { labels, values, norm } = useMemo(() => {
    const totals: Record<string, number> = {};
    let ects = 0;

    for (const c of COURSES) {
      const g = grades[c.name];
      if (typeof g !== 'number') continue;
      ects += c.ects;
      const w = courseSkillWeights(c.name);
      const s = gradeStrength(g); // dá mais peso a notas altas (curva não-linear)
      for (const [k, v] of Object.entries(w)) {
        totals[k] = (totals[k] || 0) + s * c.ects * (v as number);
      }
    }

    const sumEcts = Math.max(1, ects);
    const labels = SKILLS;
    const raw = labels.map(k => totals[k] || 0);
    const max = Math.max(1e-6, Math.max(...raw));
    // normaliza 0..1
    const values = raw.map(v => (max > 0 ? v / max : 0));
    const norm: Record<string, number> = {};
    labels.forEach((k, i) => (norm[k] = values[i]));
    return { labels, values, norm };
  }, [grades]);

  const list = labels
    .map((l) => ({ k: l, v: norm[l] || 0 }))
    .sort((a, b) => b.v - a.v);

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader><h2 className="text-lg font-semibold">Perfil de competências</h2></CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            <Radar labels={labels} values={values} title="Radar" />
            <div className="grow">
              <ol className="space-y-1">
                {list.map(({ k, v }) => (
                  <li key={k} className="flex items-center justify-between border-b border-neutral-100 py-1">
                    <span className="text-sm">{k}</span>
                    <span className="text-sm font-medium">{(v * 100).toFixed(0)}%</span>
                  </li>
                ))}
              </ol>
              <p className="text-xs text-neutral-600 mt-3">
                As percentagens são relativas à tua competência mais forte (normalização 0–100%).
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
