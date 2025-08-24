import Link from 'next/link';
import styles from './HeaderNav.module.css';

export const TABS: Array<[string, string]> = [
  ['/', 'Home'],
  ['/docker', 'Docker'],
  ['/prisma', 'Prisma/Sequelize'],
  ['/tests', 'Tests'],
  ['/about', 'About'],
];

export default function MenuTabs({
  variant = 'desktop',
  onNavigate,
}: {
  variant?: 'desktop' | 'mobile';
  onNavigate?: () => void;
}) {
  return (
    <nav className={variant === 'desktop' ? styles.tabs : styles.menuMobile}>
      {TABS.map(([href, label]) => (
        <Link key={href} href={href} className={styles.tabLink} onClick={onNavigate}>
          {label}
        </Link>
      ))}
    </nav>
  );
}