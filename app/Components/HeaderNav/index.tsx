'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './HeaderNav.module.css';
import Hamburger from './Hamburger';

const TABS: Array<[string, string]> = [
  ['/', 'Home'],
  ['/docker', 'Docker'],
  ['/prisma', 'Prisma/Sequelize'],
  ['/tests', 'Tests'],
  ['/about', 'About'],
];

export default function HeaderNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.brand}>MYWEB</div>

        {/* Desktop navigation */}
        <nav className={styles.tabs}>
          {TABS.map(([href, text]) => (
            <Link key={href} href={href} className={styles.link}>
              {text}
            </Link>
          ))}
        </nav>

        {/* The hamburger button on the upper right corner */}
        <Hamburger open={open} setOpen={setOpen} />
      </div>

      {/* Drop-down menu */}
      <ul className={`${styles.menu} ${open ? styles.menuOpen : ''}`}>
        {TABS.map(([href, text]) => (
          <li key={href} className={styles.menuItem}>
            <Link href={href} onClick={() => setOpen(false)}>
              {text}
            </Link>
          </li>
        ))}
      </ul>
    </header>
  );
}