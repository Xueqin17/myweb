'use client';

import styles from './HeaderNav.module.css';
import Brand from './Brand';
import MenuTabs from './MenuTabs';
import Actions from './Actions';
import Hamburger from './Hamburger';
import { useState } from 'react';
import Link from 'next/link';

/**
 * - MenuTabs：（themes / Docker / Prisma / Tests / About）
 * - Actions：operation area on the right
 */

const TABS: Array<[string, string]> = [
  ['/', 'Home'],                 
  ['/docker', 'Docker'],
  ['/prisma', 'Prisma/Sequelize'],
  ['/tests', 'Tests'],
  ['/about', 'About'],
];


export default function HeaderNav() {
  return (
    <nav className={styles.nav}>
      
      <div className={styles.inner}>
        <Link href="/" className={styles.brand}>CSE5006</Link>

        <ul className={styles.menu} role="menubar" aria-label="Main Navigation">
          {TABS.map(([href, label]) => (
            <li key={href} role="none">
              <Link role="menuitem" href={href} className={styles.link}>
                {label}
              </Link>
            </li>
          ))}
        </ul>

        
        <button className={styles.hamburger} aria-label="Menu">
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
}