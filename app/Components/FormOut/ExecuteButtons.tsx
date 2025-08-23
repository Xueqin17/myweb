'use client';

import React from 'react';
import styles from './FormOut.module.css';

export type FormState = {
  username: string;
  token: string;
  owner: string;
  repo: string;
};

export default function ExecuteButtons({
  form,
  pushLog,
}: {
  form: FormState;
  pushLog: (line: string) => void;
}) {
  const disabled =
    !form.username || !form.token || !form.owner || !form.repo;

  async function handleExecute() {
    try {
      pushLog('▶ Sending request to /api/run ...');
      const res = await fetch('/api/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Request failed');

      // Write each output returned by the backend to the log
      (data.output || []).forEach((line: string) => pushLog(line));
      pushLog('✔ Finished all commands.');
    } catch (e: any) {
      pushLog(`✖ Error: ${e.message}`);
    }
  }

  return (
    <div className={styles.actions}>
      <button
        className={styles.btn}
        // disabled={disabled}
        onClick={handleExecute}
      >
        Execute (Git CLI)
      </button>
    </div>
  );
}