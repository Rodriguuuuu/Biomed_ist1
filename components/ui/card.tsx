import { ReactNode } from "react";
export function Card({children,className}:{children:ReactNode,className?:string}){
  return <div className={`card ${className??""}`}>{children}</div>;
}
export function CardHeader({children}:{children:ReactNode}){
  return <div className="card-header">{children}</div>;
}
export function CardContent({children}:{children:ReactNode}){
  return <div className="card-content">{children}</div>;
}
