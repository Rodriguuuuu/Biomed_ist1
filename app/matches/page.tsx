'use client';
import { useMemo, useState } from 'react';
import companies from '@/data/companies.json';
import { SKILLS, courseSkillWeights, gradeStrength } from '@/lib/skills';
import { COURSES } from '@/data/courses';
import { useGrades, cosineSimilarity } from '@/lib/state';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

type Company = (typeof companies)[number];

/** Constrói vetor de skills por empresa:
 *  mistura 40% do perfil base da CATEGORIA + 60% de um perfil por DOMÍNIO inferido do nome (se existir).
 *  Isto cria variação real nos scores entre empresas.
 */
function skillVecFromCompany(c: Company) {
  const BASE_CAT: Record<Company['category'], Partial<Record<(typeof SKILLS)[number], number>>> = {
    Biomed: {
      'Biomedical Electronics & Instrumentation': 0.18, 'Signal Processing': 0.14, Imaging: 0.14,
      'Statistics/Data Science': 0.10, Programming: 0.06, 'Chemistry/Analytical': 0.10,
      'Systems Biology & Physiology': 0.12, 'Management/HASS': 0.06, 'Health Economics/Value': 0.10,
    },
    Tech: {
      Programming: 0.18, 'Algorithms & Modelling': 0.12, 'Statistics/Data Science': 0.10, 'Signal Processing': 0.10,
      Physics: 0.10, Mathematics: 0.10, 'Management/HASS': 0.08, Imaging: 0.06,
      'Mechanics/Biomechanics': 0.06, 'Biomedical Electronics & Instrumentation': 0.10,
    },
    Consulting: {
      'Management/HASS': 0.42, 'Health Economics/Value': 0.16, 'Statistics/Data Science': 0.10,
      'Algorithms & Modelling': 0.18, Programming: 0.14,
    },
  };

  const DOMAIN: Record<string, Partial<Record<(typeof SKILLS)[number], number>>> = {
    // Biomed
    MedTech: { 'Biomedical Electronics & Instrumentation':0.18,'Signal Processing':0.16,Imaging:0.16,'Statistics/Data Science':0.08,Programming:0.06,'Health Economics/Value':0.10, Mathematics:0.06 },
    Diagnostics: { Imaging:0.18,'Statistics/Data Science':0.16,'Chemistry/Analytical':0.14,'Signal Processing':0.10,'Management/HASS':0.06,'Biomedical Electronics & Instrumentation':0.10, Programming:0.10 },
    Biotech: { 'Molecular & Cell Bio':0.28,'Systems Biology & Physiology':0.16,'Statistics/Data Science':0.12,'Chemistry/Analytical':0.12,'Management/HASS':0.06, Programming:0.08, Imaging:0.06 },
    'Digital Health': { 'Statistics/Data Science':0.16, Programming:0.18, 'Signal Processing':0.16, 'Management/HASS':0.06, 'Health Economics/Value':0.06 },
    // Tech
    'Cloud/SaaS': { Programming:0.18, 'Algorithms & Modelling':0.10, 'Statistics/Data Science':0.10, 'Management/HASS':0.08, 'Signal Processing':0.06, Mathematics:0.06, Physics:0.06 },
    Semiconductor: { 'Biomedical Electronics & Instrumentation':0.22, Programming:0.12, 'Signal Processing':0.12, Physics:0.16, Mathematics:0.16, 'Mechanics/Biomechanics':0.10 },
    // Consulting
    'Strategy Consulting': { 'Management/HASS':0.30, 'Health Economics/Value':0.16, 'Statistics/Data Science':0.10, 'Algorithms & Modelling':0.24, Programming:0.20 },
    'Tech Consulting': { Programming:0.16, 'Algorithms & Modelling':0.18, 'Statistics/Data Science':0.14, 'Management/HASS':0.20, 'Signal Processing':0.12, Mathematics:0.10, Physics:0.10 },
    'Eng Services': { 'Mechanics/Biomechanics':0.18,'Signal Processing':0.12,'Biomedical Electronics & Instrumentation':0.12, Programming:0.12, 'Management/HASS':0.10, 'Algorithms & Modelling':0.18 },
  };

  // --- inferir 1..N domínios a partir do nome (regex heurísticas) ---
  const name = c.name.toLowerCase();
  const doms: string[] = [];
  if (/illumina|qiagen|thermo|agilent|waters|roche|bio-?rad|beckman|revvity|perkin/.test(name)) doms.push('Diagnostics');
  if (/medtronic|stryker|boston|zimmer|edwards|resmed|masimo|varian|elekta|hologic|siemens health|ge health|philips|mindray|fujifilm|canon medical|olympus|straumann|alcon|terumo|teleflex|ic[su] medical|dexcom|insulet|tandem|zoll|getinge|dräger|karl st/.test(name)) doms.push('MedTech');
  if (/sartorius|eppendorf|tecan|hamilton company|horiba|sysmex|mettler/.test(name)) doms.push('Diagnostics');
  if (/ada health|infermedica|dedalus|epic systems|cerner|compugroup|doctolib|sword health|ilo[fv]|peekmed/.test(name)) doms.push('Digital Health');
  if (/biotech|genetics|cell|molecular/.test(name)) doms.push('Biotech');
  if (/(nvidia|amd|intel|qualcomm|arm|broadcom|marvell|micron|nxp|stmicro|infineon|texas instruments|analog devices|renesas|mediatek|tsmc|asml)/.test(name)) doms.push('Semiconductor');
  if (/(aws|azure|microsoft|google|gcp|snowflake|datadog|mongodb|elastic|confluent|hashicorp|nutanix|servicenow|workday|atlassian|git(hub|lab)|twilio|stripe|shopify|cloudflare|akamai|fastly|salesforce|oracle|sap)/.test(name)) doms.push('Cloud/SaaS');
  if (/(mckinsey|bcg|bain|strategy&|oliver wyman|roland berger|kearney|lek|cra|nera|cornerstone|iqvia|putnam)/.test(name)) doms.push('Strategy Consulting');
  if (/(accenture|deloitte|pwc|ey|kpmg|ibm consulting|capgemini|ntt data|atos|eviden|cgi|sopra|dxc|tcs|infosys|wipro|cognizant|hcl|tech mahindra|epam|globant|endava|luxoft)/.test(name)) doms.push('Tech Consulting');
  if (/(alten|akkodis|altran|capgemini engineering|expleo|quest global|wsp|aecom|jacobs|ramboll|arup|mott macdonald|sweco|atkins)/.test(name)) doms.push('Eng Services');

  // vetor base (categoria)
  const base = BASE_CAT[c.category] ?? {};

  // média dos domínios
  const agg: Record<string, number> = {};
  for (const d of doms) {
    const prof = DOMAIN[d]; if (!prof) continue;
    for (const [k, v] of Object.entries(prof)) agg[k] = (agg[k] || 0) + (v as number);
  }
  const domVec: Partial<Record<(typeof SKILLS)[number], number>> = {};
  for (const k of SKILLS) (domVec as any)[k] = doms.length ? (agg[k] || 0) / doms.length : 0;

  // mistura: 60% domínio + 40% categoria (se houver domínio)
  const mixed = SKILLS.map((s) => {
    const cat = (base as any)[s] || 0;
    const dom = (domVec as any)[s] || 0;
    return doms.length ? 0.6 * dom + 0.4 * cat : cat;
  });

  // ——— variação determinística por empresa (±5% por skill) para quebrar empates ———
  const seed = [...c.name].reduce((h, ch) => ((h << 5) - h + ch.charCodeAt(0)) | 0, 0);
  function jitter(i: number) {
    // número pseudo-aleatório estável por empresa+skill
    let x = seed ^ (i * 2654435761);
    x = (x ^ (x >>> 15)) * 2246822519;
    x = (x ^ (x >>> 13)) * 3266489917;
    const r = ((x >>> 0) % 1000) / 1000; // 0..1
    return (r - 0.5) * 0.10;             // -0.05 .. +0.05 (±5%)
  }
  const withJitter = mixed.map((v, i) => Math.max(0, v * (1 + jitter(i))));

  // normaliza
  const sum = withJitter.reduce((a, b) => a + b, 0) || 1;
  return withJitter.map((v) => v / sum);
}

function userSkillVec(grades: Record<string, number | undefined>) {
  const totals: Record<string, number> = {};
  let ects = 0;
  for (const c of COURSES) {
    const g = grades[c.name];
    if (typeof g !== 'number') continue;
    ects += c.ects;
    const w = courseSkillWeights(c.name);
    const s = gradeStrength(g);
    for (const [k, v] of Object.entries(w)) {
      totals[k] = (totals[k] || 0) + s * c.ects * (v as number);
    }
  }
  return SKILLS.map((k) => (totals[k] || 0) / (ects || 1));
}

export default function MatchesPage() {
  const profileId = typeof window !== 'undefined' ? localStorage.getItem('currentProfileId.v1') : null;
  const { grades } = useGrades(profileId);
  const [filter, setFilter] = useState<'All' | 'Biomed' | 'Tech' | 'Consulting'>('All');

  const uvec = useMemo(() => userSkillVec(grades), [grades]);
  const hasAny = useMemo(()=> uvec.some(v=>v>0), [uvec]);

  const ranked = useMemo(() => {
    const arr = (companies as Company[])
      .filter((c) => filter === 'All' || c.category === filter)
      .map((c) => {
        const cvec = skillVecFromCompany(c);
        const fit = cosineSimilarity(uvec, cvec);
        const score = Math.round(Math.max(0, Math.min(1, fit)) * 100);
        return { ...c, score };
      })
      .sort((a, b) => b.score - a.score);
    return arr.slice(0, 50);
  }, [uvec, filter]);

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Empresas recomendadas</h2>
          <div className="flex gap-2">
            {(['All', 'Biomed', 'Tech', 'Consulting'] as const).map((k) => (
              <button
                key={k}
                className={`btn ${filter === k ? 'btn-primary' : ''}`}
                onClick={() => setFilter(k)}
              >
                {k}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          {!hasAny && (
            <div className="p-3 text-sm text-neutral-700">
              Preenche pelo menos uma nota em <strong>Notas &amp; GPA</strong> para ver variação no ranking.
            </div>
          )}
          <ol className="space-y-2">
            {ranked.map((c, i) => (
              <li key={c.id} className="card p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-6 text-right">{i + 1}.</span>
                  <div>
                    <div className="font-medium">{c.name}</div>
                    <div className="text-xs text-neutral-600">{c.category} • EU/Global</div>
                  </div>
                </div>
                <div className="text-sm">
                  <span className="badge">Score {c.score}</span>
                </div>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
