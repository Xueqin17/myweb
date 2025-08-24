import styles from './HeaderNav.module.css';

/** Left title, after click return to homepage */
export default function Brand() {
  return <a className={styles.brand} href="/(assignment)">MYWEB</a>;
}