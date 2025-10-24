'use client';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import { createProfile, login, useAuth, logout, setCurrentProfileId } from "@/lib/auth";
import { FormEvent, useState } from "react";

export default function Page(){
  const { username, profiles, refresh } = useAuth();
  const [mode,setMode] = useState<'login'|'create'>('login');
  const [u,setU]=useState(''); const [p,setP]=useState('');
  const [msg,setMsg]=useState<string|null>(null);

  async function onSubmit(e:FormEvent){
    e.preventDefault();
    setMsg(null);
    try{
      if(mode==='login') await login(u,p);
      else await createProfile(u,p);
      setU(''); setP(''); refresh();
      setMsg('Sessão iniciada.');
    }catch(err:any){ setMsg(err?.message||'Erro'); }
  }

  function handleSwitch(id:string){
    setCurrentProfileId(id); refresh();
  }

  return (
    <div className="grid gap-6">
      <div className="hero header-grad">
        <h1>Engenharia Biomédica IST — GPA & Matches</h1>
        <p className="sub mt-1">Local-first (dados ficam no teu navegador). Introduz apenas as tuas notas; calculamos GPA, competências e empresas com melhor alinhamento.</p>
        <div className="mt-4 flex gap-3">
          <Link href="/grades" className="btn">Começar nas Notas</Link>
          <Link href="/about" className="btn">Sobre/Privacidade</Link>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><h2 className="text-lg font-semibold">Sessão & Perfis (local)</h2></CardHeader>
          <CardContent>
            {username ? (
              <div>
                <p className="mb-2">Sessão ativa: <strong>{username}</strong></p>
                {profiles.length>1 && (
                  <div className="mb-3">
                    <label className="text-sm font-medium">Mudar de perfil</label>
                    <div className="flex gap-2 mt-1">
                      {profiles.map(p=> (
                        <button key={p.id} className="btn" onClick={()=>handleSwitch(p.id)}>{p.username}</button>
                      ))}
                    </div>
                  </div>
                )}
                <button className="btn" onClick={()=>{logout(); refresh();}}>Terminar sessão</button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="grid gap-2 max-w-sm">
                <div className="flex gap-2 text-sm mb-1">
                  <button type="button" className={`btn ${mode==='login'?'bg-neutral-50':''}`} onClick={()=>setMode('login')}>Entrar</button>
                  <button type="button" className={`btn ${mode==='create'?'bg-neutral-50':''}`} onClick={()=>setMode('create')}>Criar conta (local)</button>
                </div>
                <label className="text-sm font-medium">Utilizador</label>
                <input className="input" value={u} onChange={e=>setU(e.currentTarget.value)} required/>
                <label className="text-sm font-medium mt-2">Palavra-passe</label>
                <input className="input" type="password" value={p} onChange={e=>setP(e.currentTarget.value)} required/>
                <button className="btn mt-2" type="submit">{mode==='login'?'Entrar':'Criar conta'}</button>
                {msg && <div className="text-sm mt-2">{msg}</div>}
                <p className="text-xs text-neutral-600 mt-2">As contas são <em>apenas locais</em> (este dispositivo/navegador). Não há servidor.</p>
              </form>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><h2 className="text-lg font-semibold">Dicas rápidas</h2></CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 text-sm">
              <li>Tab/Shift+Tab para navegar na tabela; <span className="kbd">Setas</span> para mover entre inputs.</li>
              <li>As Notas guardam automaticamente (autosave localStorage).</li>
              <li>Abre <strong>Matches</strong> depois de preencheres pelo menos uma UC.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
