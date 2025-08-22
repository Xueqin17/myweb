'use client';

import styles from './HeaderNav.module.css';
import Brand from './Brand';
import MenuTabs from './MenuTabs';
import Actions from './Actions';
import Hamburger from './Hamburger';
import { useState } from 'react';

/**
 * - MenuTabs：（themes / Docker / Prisma / Tests / About）
 * - Actions：operation area on the right
 */
export default function HeaderNav() {
  const [open, setOpen] = useState(false); 
  return (
    <div className={styles.header} role="navigation" aria-label="Main">
      <Brand />
      <Hamburger open={open} setOpen={setOpen} />
      <MenuTabs open={open} setOpen={setOpen} />
      <Actions />
    </div>
  );
}