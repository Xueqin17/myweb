'use client';
import { useEffect } from 'react';


export default function ThemeWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const next = saved ?? 'light';
    document.documentElement.setAttribute('data-theme', next);
  }, []);
  return <>{children}</>;
}