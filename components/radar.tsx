'use client';
import React from 'react';

type Point = { x:number, y:number };
export function RadarChart({labels,values,size=380,max=1}:{labels:string[],values:number[],size?:number,max?:number}){
  const N=labels.length;
  const cx=size/2, cy=size/2, r=size*0.38;
  function pol(i:number, val:number):Point{
    const ang = (Math.PI*2 * i / N) - Math.PI/2;
    const rv = (val/max)*r;
    return { x: cx + rv*Math.cos(ang), y: cy + rv*Math.sin(ang) };
  }
  const grid = Array.from({length:4},(_,k)=>k+1).map(k=>{
    const rr=r*k/4;
    return <circle key={k} cx={cx} cy={cy} r={rr} fill="none" stroke="currentColor" strokeOpacity={0.1}/>;
  });
  const poly = values.map((v,i)=>pol(i, v)).map(p=>`${p.x},${p.y}`).join(" ");
  return (
    <svg width={size} height={size} role="img" aria-label="Radar de competências">
      {grid}
      <polygon points={poly} fill="currentColor" opacity={0.12} />
      <polyline points={poly+" "+poly.split(" ")[0]} fill="none" stroke="currentColor" />
      {labels.map((lab,i)=>{
        const p=pol(i, max*1.08);
        return <text key={i} x={p.x} y={p.y} fontSize="11" textAnchor="middle">{lab}</text>;
      })}
    </svg>
  );
}
