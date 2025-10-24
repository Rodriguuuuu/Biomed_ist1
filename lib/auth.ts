'use client';
type Profile = { id: string; username: string; passhash: string };
const PKEY = 'profiles.v1';
const CKEY = 'currentProfileId.v1';

function sha256(s:string){
  const enc = new TextEncoder();
  const data = enc.encode(s);
  return crypto.subtle.digest('SHA-256', data).then(buf =>
    Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,'0')).join('')
  );
}

export async function createProfile(username:string, password:string){
  username = username.trim();
  if (!username || !password) throw new Error('username/password em falta');
  const passhash = await sha256(password);
  const id = 'p_'+Math.random().toString(36).slice(2,10);
  const p: Profile = { id, username, passhash };
  const list = getProfiles();
  if (list.some(x=>x.username.toLowerCase()===username.toLowerCase()))
    throw new Error('username já existe');
  list.push(p);
  localStorage.setItem(PKEY, JSON.stringify(list));
  localStorage.setItem(CKEY, id);
  return p;
}

export function getProfiles(): Profile[]{
  try { return JSON.parse(localStorage.getItem(PKEY) || '[]') as Profile[]; } catch { return []; }
}
export function getCurrentProfileId(): string | null { return localStorage.getItem(CKEY); }
export function setCurrentProfileId(id: string | null){ if (id) localStorage.setItem(CKEY, id); else localStorage.removeItem(CKEY); }

export async function login(username:string, password:string){
  const list = getProfiles();
  const ph = await sha256(password);
  const p = list.find(x=>x.username.toLowerCase()===username.toLowerCase() && x.passhash===ph);
  if (!p) throw new Error('credenciais inválidas');
  localStorage.setItem(CKEY, p.id);
  return p;
}
export function logout(){ localStorage.removeItem(CKEY); }

export type AuthState = { profileId: string|null, username: string|null, profiles: Profile[] };
import { useEffect, useState } from 'react';
export function useAuth(){
  const [state,setState] = useState<AuthState>({ profileId: null, username: null, profiles: [] });
  const refresh = ()=>{
    const list = getProfiles();
    const pid = getCurrentProfileId();
    const name = list.find(x=>x.id===pid)?.username || null;
    setState({ profileId: pid, username: name, profiles: list });
  };
  useEffect(()=>{ refresh(); },[]);
  return { ...state, refresh };
}
