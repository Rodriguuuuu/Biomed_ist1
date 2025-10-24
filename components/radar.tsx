'use client';
import React from 'react';

type Props = { labels: readonly string[]; values: readonly number[]; title?: string };

export default function Radar({ labels, values, title }: Props) {
  const N = values.length;
  const R = 110; // raio
  const cx = 140, cy = 140;

  function point(i: number, v: number) {
    const a = (-Math.PI / 2) + (2 * Math.PI * i) / N;
    return [cx + Math.cos(a) * R * v, cy + Math.sin(a) * R * v];
  }
  const path = values.map((v, i) => point(i, v));
  const poly = path.map(p => p.join(',')).join(' ');

  return (
    <div className="card p-3">
      {title && <div className="font-medium mb-2">{title}</div>}
      <svg width="280" height="280" role="img" aria-label="Radar de competências">
        <defs>
          <linearGradient id="radarFill" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopOpacity="0.25" stopColor="#6366f1"/>
            <stop offset="100%" stopOpacity="0.15" stopColor="#22c55e"/>
          </linearGradient>
        </defs>

        {/* grelha */}
        {[0.25, 0.5, 0.75, 1].map((r) => (
          <circle key={r} cx={cx} cy={cy} r={R*r} className="stroke-neutral-200 fill-none" />
        ))}

        {/* eixos */}
        {labels.map((_, i) => {
          const [x, y] = point(i, 1);
          return <line key={i} x1={cx} y1={cy} x2={x} y2={y} className="stroke-neutral-200" />;
        })}

        {/* polígono */}
        <polygon points={poly} fill="url(#radarFill)" stroke="#6366f1" strokeWidth="2" />

        {/* labels */}
        {labels.map((lab, i) => {
          const [x, y] = point(i, 1.12);
          return (
            <text key={i} x={x} y={y} textAnchor="middle" className="text-[10px] fill-neutral-700">
              {lab}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
