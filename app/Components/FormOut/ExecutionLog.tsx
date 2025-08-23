'use client';
import styles from './FormOut.module.css';

export default function ExecutionLog({ logs }: { logs: string[] }) {
  return (
    <div className={styles.log}>
      {logs.length ? logs.join('\n') : 'Execution Log will appear here…'}
    </div>
  );
}