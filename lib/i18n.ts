export type Lang = 'pt'|'en';
export const D = {
  pt: {
    title: "Engenharia Biomédica IST — GPA & Matches",
    nav: { home:"Início", grades:"Notas & GPA", skills:"Competências", matches:"Matches", library:"Empresas", about:"Sobre/Privacidade" },
    intro: "Aplicação local-first. Introduz apenas as tuas notas; o resto é automático.",
    gpa: { title:"GPA (ECTS ponderado)", expl:"Soma(Nota × ECTS) / Soma(ECTS com nota). Conversões: 0–4 = 4×(GPA/20); 0–100 = 5×GPA." },
    actions: { export:"Exportar JSON", import:"Importar JSON", pdf:"Download PDF", clear:"Limpar notas" },
    table: { course:"UC", ects:"ECTS", grade:"Nota (0–20)" },
    skills: { title:"Perfil de competências", thresholds:"Limiares", strong:"Forte ≥", solid:"Sólido ≥", base:"Base ≥" },
    matches: { title:"Empresas recomendadas", top:"Top alinhamento", skillsOverlap:"Skills em comum" },
    about: { privacy:"Dados ficam no teu navegador. Sem chamadas externas.", formulas:"Fórmulas e regras explicadas.", keyboard:"Acessibilidade: usa Tab/Shift+Tab. 'Ir para conteúdo' disponível." },
    lang:"PT", langSwitch:"EN"
  },
  en: {
    title: "IST Biomedical Eng — GPA & Matches",
    nav: { home:"Home", grades:"Grades & GPA", skills:"Skills", matches:"Matches", library:"Company Library", about:"About/Privacy" },
    intro: "Local-first app. Just enter your grades; everything else is automatic.",
    gpa: { title:"GPA (ECTS-weighted)", expl:"Sum(Grade × ECTS) / Sum(ECTS with grade). Conversions: 0–4 = 4×(GPA/20); 0–100 = 5×GPA." },
    actions: { export:"Export JSON", import:"Import JSON", pdf:"Download PDF", clear:"Clear grades" },
    table: { course:"Course", ects:"ECTS", grade:"Grade (0–20)" },
    skills: { title:"Skills profile", thresholds:"Thresholds", strong:"Strong ≥", solid:"Solid ≥", base:"Baseline ≥" },
    matches: { title:"Recommended employers", top:"Top match", skillsOverlap:"Overlapping skills" },
    about: { privacy:"Data stays in your browser. No external calls.", formulas:"Formulas and rules documented.", keyboard:"Accessibility: use Tab/Shift+Tab. 'Skip to content' available." },
    lang:"EN", langSwitch:"PT"
  }
} as const;
