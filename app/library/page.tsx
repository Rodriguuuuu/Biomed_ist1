'use client';
import { useMemo, useState } from 'react';
import companies from '@/data/companies.json';
import { SKILLS, courseSkillWeights, gradeStrength } from '@/lib/skills';
import { COURSES } from '@/data/courses';
import { useGrades, cosineSimilarity } from '@/lib/state';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

type Company = (typeof companies)[number];

function skillVecFromCompany(c: Company) {
  // Perfis base por categoria – apenas skills que existem em SKILLS
  const map: Record<Company['category'], Partial<Record<(typeof SKILLS)[number], number>>> = {
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
      // Sem "Communication": redistribuído por skills existentes
      'Management/HASS': 0.42,
      'Health Economics/Value': 0.16,
      'Statistics/Data Science': 0.10,
      'Algorithms & Modelling': 0.18,
      Programming: 0.14,
    },
  };

  const base = map[c.category] ?? {};
  const vec = SKILLS.map((s) => (base as any)[s] || 0);
  const sum = vec.reduce((a, b) => a + b, 0) || 1;
  return vec.map((v) => v / sum); // normaliza
}

function userSkillVec(grades: Record<string, number | undefined>) {
  const totals: Record<string, number> = {};
  let ects = 0;
  for (const c of COURSES) {
    const g = grades[c.name];
    if (typeof g !== 'number') continue;


