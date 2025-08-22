'use client';

import styles from './HeaderNav.module.css';
import { useEffect, useState } from 'react';

// Menu configuration
const TABS: Array<[string, string]> = [
  ['/', 'themes'],          // Homepage
  ['/docker', 'Docker'],
  ['/prisma', 'Prisma/Sequelize'],
  ['/tests', 'Tests'],
  ['/about', 'About'],
];
export default function MenuTabs({ open, setOpen }:{
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  // Highlighted menu (recovery from cookie)
  const [active, setActive] = useState('/(assignment)');

  useEffect(() => {
    // Read cookie：activeTab=/xxx
    const m = document.cookie.match(/activeTab=([^;]+)/);
    if (m) setActive(decodeURIComponent(m[1]));
  }, []);

  // Click the menu: Highlight + Write cookie + Close mobile menu
  const onClick = (href: string) => {
    setActive(href);
    document.cookie = `activeTab=${encodeURIComponent(href)}; path=/; max-age=2592000`;
    setOpen(false);
  };

  return (
    <ul className={`${styles.menu} ${open ? styles.open : ''}`} id="main-menu">
      {TABS.map(([href, label]) => (
        <li key={href}>
          <a
            href={href}
            className={active === href ? styles.activeLink : undefined}
            onClick={() => onClick(href)}
          >
            {label}
          </a>
        </li>
      ))}
    </ul>
  );
}