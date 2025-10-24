'use client';
import React from 'react';

export default function ProgressRing({ value, size=120, stroke=10, label }:{
  value: number;        // 0..100
  size?: number;        // px
  stroke?: number;      // px
  label?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, value));
  const offset = c * (1 - clamped/100);

  return (
    <div className="inline-flex items-center justify-center" style={{width:size, height:size}}>
      <svg width={size} height={size} role="img" aria-label={label ?? `Progresso ${clamped}%`}>
        <circle cx={size/2} cy={size/2} r={r} stroke="#eee" strokeWidth={stroke} fill="none" />
        <circle cx={size/2} cy={size/2} r={r} stroke="currentColor" strokeWidth={stroke}
                strokeLinecap="round" fill="none"
                strokeDasharray={c} strokeDashoffset={c - offset}
                transform={`rotate(-90 ${size/2} ${size/2})`} />
      </svg>
      <div className="absolute text-sm font-semibold">{Math.round(clamped)}%</div>
    </div>
  );
}
