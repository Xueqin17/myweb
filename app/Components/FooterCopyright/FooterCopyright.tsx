'use client';
import styles from './FooterCopyright.module.css';
import { useEffect, useState } from 'react';

export default function FooterCopyright() {
  
  const [date, setDate] = useState<string>('');
  useEffect(() => {
    setDate(new Date().toLocaleDateString());
  }, []);

  return (
    <footer className={styles.footer} role="contentinfo">
      Copyright © Xueqin HE · 22144656
      {date ? ` · ${date}` : null}
    </footer>
  );
}