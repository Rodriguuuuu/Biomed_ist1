function skillVecFromCompany(c: Company) {
  // --- perfis base por CATEGORIA ---
  const BASE_CAT: Record<Company['category'], Partial<Record<(typeof SKILLS)[number], number>>> = {
    Biomed: {
      'Biomedical Electronics & Instrumentation': 0.18,
      'Signal Processing': 0.14,
      Imaging: 0.14,
      'Statistics/Data Science': 0.10,
      Programming: 0.06,
      'Chemistry/Analytical': 0.10,
      'Systems Biology & Physiology': 0.12,
      'Management/HASS': 0.06,
      'Health Economics/Value': 0.10,
    },
    Tech: {
      Programming: 0.18,
      'Algorithms & Modelling': 0.12,
      'Statistics/Data Science': 0.10,
      'Signal Processing': 0.10,
      Physics: 0.10,
      Mathematics: 0.10,
      'Management/HASS': 0.08,
      Imaging: 0.06,
      'Mechanics/Biomechanics': 0.06,
      'Biomedical Electronics & Instrumentation': 0.10,
    },
    Consulting: {
      'Management/HASS': 0.42,
      'Health Economics/Value': 0.16,
      'Statistics/Data Science': 0.10,
      'Algorithms & Modelling': 0.18,
      Programming: 0.14,
    },
  };

  // --- perfis por DOMÍNIO (síntese) ---
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
    'Eng Services': { 'Mechanics/Biomechanics':0.18,'Signal Processing':0.12,'Biomedical Electronics & Instrumentation':0.12, Programming:0.12, 'Management/HASS':0.10, 'Algorithms & Modelling':0.18, },
  };

  // --- heurísticas: nome → domínio ---
  const name = c.name.toLowerCase();
  const doms: string[] = [];
  // Biomed domains
  if (/illumina|qiagen|thermo|agilent|waters|roche|bio-?rad|beckman|perkin|revvity/.test(name)) doms.push('Diagnostics');
  if (/medtronic|stryker|boston|zimmer|edwards|resmed|masimo|varian|elekta|hologic|siemens health|ge health|philips|mindray|fujifilm|canon medical|olympus|straumann|alcon|terumo|teleflex|ic[su] medical|dexcom|insulet|tandem|zoll|getinge|dräger|karl st/.test(name)) doms.push('MedTech');
  if (/sartorius|eppendorf|bruke|tecan|hamilton company|horiba|sysmex|mettler/.test(name)) doms.push('Diagnostics');
  if (/ada health|infermedica|dedalus|epic systems|cerner|compugroup|doctolib|sword health|ilo[fv]|peekmed/.test(name)) doms.push('Digital Health');
  if (/novo|biotech|genetics|cell|molecular/.test(name)) doms.push('Biotech');

  // Tech domains
  if (/(nvidia|amd|intel|qualcomm|arm|broadcom|marvell|micron|nxp|stmicro|infineon|texas instruments|analog devices|renesas|mediatek|tsmc|asml)/.test(name)) doms.push('Semiconductor');
  if (/(aws|azure|microsoft|google|gcp|snowflake|datadog|mongodb|elastic|confluent|hashicorp|nutanix|servicenow|workday|atlassian|git(hub|lab)|twilio|stripe|shopify|cloudflare|akamai|fastly|salesforce|oracle|sap)/.test(name)) doms.push('Cloud/SaaS');

  // Consulting domains
  if (/(mckinsey|bcg|bain|strategy&|oliver wyman|roland berger|kearney|lek|cra|nera|cornerstone|iqvia|putnam|ow)/.test(name)) doms.push('Strategy Consulting');
  if (/(accenture|deloitte|pwc|ey|kpmg|ibm consulting|capgemini|ntt data|atos|eviden|cgi|sopra|dxc|tcs|infosys|wipro|cognizant|hcl|tech mahindra|epam|globant|endava|luxoft)/.test(name)) doms.push('Tech Consulting');
  if (/(alten|akkodis|altran|capgemini engineering|expleo|quest global|wsp|aecom|jacobs|ramboll|arup|mott macdonald|sweco|atkins)/.test(name)) doms.push('Eng Services');

  // vetor categoria base
  const base = BASE_CAT[c.category] ?? {};

  // vetor domínio (média se houver vários)
  let domVec: Partial<Record<(typeof SKILLS)[number], number>> = {};
  if (doms.length) {
    const agg: Record<string, number> = {};
    for (const d of doms) {
      const profile = DOMAIN[d];
      if (!profile) continue;
      for (const [k,v] of Object.entries(profile)) agg[k] = (agg[k]||0) + (v as number);
    }
    // média
    for (const k of SKILLS) (domVec as any)[k] = (agg[k]||0) / doms.length;
  }

  // mix 60% domínio + 40% categoria (se houver domínio); caso contrário 100% categoria
  const vecRaw = SKILLS.map((s)=>{
    const cat = (base as any)[s] || 0;
    const dom = (domVec as any)[s] || 0;
    return doms.length ? 0.6*dom + 0.4*cat : cat;
  });

  const sum = vecRaw.reduce((a,b)=>a+b,0) || 1;
  return vecRaw.map(v=>v/sum);
}
