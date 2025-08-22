'use client';

import styles from './ThemeToggle.module.css';
import { useEffect, useState } from 'react';


export default function ThemeToggle() {
  const [checked, setChecked] = useState(false);


  useEffect(() => {
    const current = document.documentElement.getAttribute('data-theme');
    setChecked(current === 'dark');
  }, []);

  const onToggle = (next: boolean) => {
    setChecked(next);
    const theme = next ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  };

  return (
    <div className={styles.wrap} aria-label="Theme Switch">
      <label className={styles.switch}>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onToggle(e.target.checked)}
          aria-label="Toggle dark mode"
        />
        <span className={styles.slider} />
      </label>
      <span className={styles.label}>Dark Mode</span>
    </div>
  );
}