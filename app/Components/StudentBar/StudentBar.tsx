import styles from './StudentBar.module.css';


export default function StudentBar() {
  return (
    <div className={styles.bar} aria-label="Student Number">
      Student No: 22144656
    </div>
  );
}