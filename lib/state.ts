'use client';
import { useEffect, useMemo, useState } from 'react';
import { COURSES } from '@/data/courses';
import { gradeStrength } from '@/lib/skills';

export type GradeMap = Record<string, number|undefined>;
const KEY='grades.v1';

export function useGrades(){
  const [grades,setGrades] = useState<GradeMap>({});
  useEffect(()=>{
    try{
      const raw=localStorage.getItem(KEY);
      if(raw) setGrades(JSON.parse(raw));
    }catch{}
  },[]);
  useEffect(()=>{
    try{ localStorage.setItem(KEY, JSON.stringify(grades)); }catch{}
  },[grades]);
  const update = (name:string, value:number|undefined)=> setGrades(g=>({...g,[name]:value}));
  const clear = ()=> setGrades({});
  const stats = useMemo(()=>{
    let sum=0, ects=0;
    for (const c of COURSES){
      const g = grades[c.name];
      if (typeof g === 'number') { sum += g * c.ects; ects += c.ects; }
    }
    const gpa20 = ects>0? sum/ects : 0;
    return {
      ectsFilled: ects,
      gpa20,
      gpa4: 4*(gpa20/20),
      gpa100: 5*gpa20,
      progress: ects
    };
  },[grades]);
  const filled = useMemo(()=> COURSES.filter(c=>typeof grades[c.name]==='number').length, [grades]);
  return { grades, update, clear, stats, filled };
}

export function cosineSimilarity(a:number[], b:number[]){
  let dot=0, na=0, nb=0;
  for (let i=0;i<a.length;i++){ dot += a[i]*b[i]; na += a[i]*a[i]; nb += b[i]*b[i]; }
  if (na===0||nb===0) return 0;
  return dot / (Math.sqrt(na)*Math.sqrt(nb));
}
