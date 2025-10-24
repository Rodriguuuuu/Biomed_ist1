import { ReactNode } from "react";

type WithClass = { children: ReactNode; className?: string };

export function Card({ children, className }: WithClass) {
  return <div className={`card ${className ?? ""}`}>{children}</div>;
}
export function CardHeader({ children, className }: WithClass) {
  return <div className={`card-header ${className ?? ""}`}>{children}</div>;
}
export function CardContent({ children, className }: WithClass) {
  return <div className={`card-content ${className ?? ""}`}>{children}</div>;
}
