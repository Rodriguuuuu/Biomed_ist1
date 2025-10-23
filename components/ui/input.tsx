import { InputHTMLAttributes, forwardRef } from "react";
export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function Inp({className,...rest}, ref){
  return <input ref={ref} {...rest} className={`input ${className??""}`} />;
});
