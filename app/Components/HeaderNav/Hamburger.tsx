'use client';

import styles from './HeaderNav.module.css';

/**
 The aria- attribute enhances accessibility 
 for screen readers/keyboard navigation.
 */
export default function Hamburger({ open, setOpen }:{
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  return (
    <button
      className={`${styles.hamburger} ${open ? styles.active : ''}`}
      onClick={() => setOpen(!open)}
      aria-label="Menu"
      aria-expanded={open}
      aria-controls="main-menu"
    >
      <span /><span /><span />
    </button>
  );
}