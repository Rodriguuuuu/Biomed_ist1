'use client';
import React from 'react';

export function ProgressRing({value,max=20,size=120,stroke=10}:{value:number,max?:number,size?:number,stroke?:number}){
  const radius=(size-stroke)/2;
  const circ=2*Math.PI*radius;
  const pct=Math.max(0,Math.min(1,value/max));
  const dash=circ*pct;
  return (
    <svg width={size} height={size} role="img" aria-label={`GPA ${value.toFixed(2)} de ${max}`}>
      <circle cx={size/2} cy={size/2} r={radius} strokeWidth={stroke} strokeOpacity={0.15} stroke="currentColor" fill="none"/>
      <circle cx={size/2} cy={size/2} r={radius} strokeWidth={stroke} strokeDasharray={`${dash} ${circ-dash}`} strokeLinecap="round" stroke="currentColor" fill="none" transform={`rotate(-90 ${size/2} ${size/2})`}/>
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="18" fontWeight={700}>{value.toFixed(2)}</text>
    </svg>
  );
}
