export const SKILLS = [
  "Mathematics","Physics","Programming","Algorithms & Modelling","Signal Processing",
  "Biomedical Electronics & Instrumentation","Mechanics/Biomechanics","Chemistry/Analytical",
  "Molecular & Cell Bio","Systems Biology & Physiology","Pharmacology","Statistics/Data Science",
  "Imaging","Management/HASS","Health Economics/Value"
] as const;
export type Skill = typeof SKILLS[number];

export function courseSkillWeights(course: string): Partial<Record<Skill, number>> {
  const m = new Map<Skill, number>();
  const add = (k:Skill,v:number)=>m.set(k,(m.get(k)||0)+v);
  const c = course;

  if (/Linear Algebra|Calculus/i.test(c)) add("Mathematics",1.0);
  else if (/Physics/i.test(c)) add("Physics",1.0);
  else if (/Computation|Programming/i.test(c)) { add("Programming",0.6); add("Algorithms & Modelling",0.4); }
  else if (/Algorithms.*Modell/i.test(c)) { add("Algorithms & Modelling",0.7); add("Programming",0.3); }
  else if (/Signals? and Systems/i.test(c)) { add("Signal Processing",0.7); add("Algorithms & Modelling",0.3); }
  else if (/Bioelectricity/i.test(c)) { add("Biomedical Electronics & Instrumentation",0.8); add("Signal Processing",0.2); }
  else if (/Bioinstrumentation/i.test(c)) { add("Biomedical Electronics & Instrumentation",1.0); }
  else if (/Instrumental Analysis|Chemistry|Organic/i.test(c)) { add("Chemistry/Analytical",1.0); }
  else if (/Molecular Biology|Cellular/i.test(c)) { add("Molecular & Cell Bio",1.0); }
  else if (/Systems Physiology|Metabolic Integration|General Mechanisms of Disease/i.test(c)) { add("Systems Biology & Physiology",1.0); }
  else if (/Pharmacology/i.test(c)) { add("Pharmacology",1.0); }
  else if (/Probability and Statistics/i.test(c)) { add("Statistics/Data Science",1.0); }
  else if (/Computational Modelling.*Mechanics|Mechanics Applied/i.test(c)) { add("Mechanics/Biomechanics",0.6); add("Algorithms & Modelling",0.4); }
  else if (/Biosignals.*Imaging|Imaging/i.test(c)) { add("Imaging",0.6); add("Signal Processing",0.4); }
  else if (/Management|HASS|Health Value/i.test(c)) { add("Management/HASS",1.0); add("Health Economics/Value",1.0); }
  else {
    add("Programming",0.34); add("Mathematics",0.33); add("Physics",0.33);
  }
  return Object.fromEntries(m.entries());
}

export function gradeStrength(grade:number){ return Math.max(0,(grade-10)/10); } // 10–20 -> 0..1
