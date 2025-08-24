'use client';

import styles from './HeaderNav.module.css';

type Props = {
  open: boolean;
  setOpen: (v: boolean) => void;
};

export default function Hamburger({ open, setOpen }: Props) {
  return (
    <button
      aria-label={open ? 'Close menu' : 'Open menu'}
      className={`${styles.burger} ${open ? styles.open : ''}`}
      onClick={() => setOpen(!open)}
    >
      <span />
      <span />
      <span />
    </button>
  );
}