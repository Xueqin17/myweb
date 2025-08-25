'use client';

import React, { useMemo, useState } from 'react';
import styles from './FormOut.module.css';

import ExecuteButtons, { type FormState } from './ExecuteButtons';
import ExecutionLog from './ExecutionLog';

export default function FormOut() {
  
  const [form, setForm] = useState<FormState>({
    username: '',
    token: '',
    owner: '',
    repo: '',
  });

  
  const [logs, setLogs] = useState<string[]>([]);
  const pushLog = (line: string) =>
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${line}`]);

 
  const set = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value.trim() }));

  // Command preview based on input to dispaly
  const preview = useMemo(() => {
    const U = form.username || '<username>';
    const T = form.token || '<token>';
    const O = form.owner || '<owner>';
    const R = form.repo || '<repository>';

    return [
      `git clone https://${U}:${T}@github.com/${O}/${R}.git`,
      `cd ${R}`,
      `git checkout -b update-readme`,
      `echo "## This is the System" >> README.md`,
      `echo "Successfully connected!" >> README.md`,
      `git add README.md`,
      `git commit -m "Update README.md: Add new section"`,
      `git push -u origin update-readme`,
      `gh pr create --title "Update README.md" --body "Added a new section to the README"`,
    ].join('\n');
  }, [form.username, form.token, form.owner, form.repo]);

  return (
    <div className={styles.wrap}>
      {/* Form */}
      <section className={styles.card}>
        <div className={styles.title}>Inputs</div>

        <label className={styles.row}>
          <span className={styles.label}>Username</span>
          <input
            id="u"
            className={styles.input}
            placeholder="Github username"
            value={form.username}
            onChange={set('username')}
          />
        </label>

        <label className={styles.row}>
          <span className={styles.label}>Token</span>
          <input
            id="t"
            type="password"
            className={styles.input}
            placeholder="Token "
            value={form.token}
            onChange={set('token')}
          />
        </label>

        <label className={styles.row}>
          <span className={styles.label}>Owner</span>
          <input
            id="o"
            className={styles.input}
            placeholder="Repo owner"
            value={form.owner}
            onChange={set('owner')}
          />
        </label>

        <label className={styles.row}>
          <span className={styles.label}>Repository</span>
          <input
            id="r"
            className={styles.input}
            placeholder="Repository name"
            value={form.repo}
            onChange={set('repo')}
          />
        </label>
      </section>

      {/* Execute area */}
      <section className={styles.card}>
        <div className={styles.title}>Execute Commands</div>

        {/* Command preview */}
        <pre className={styles.pre}>{preview}</pre>

        {/*Execute button */}
        <ExecuteButtons form={form} pushLog={pushLog} />

       
        <ExecutionLog logs={logs} />
      </section>
    </div>
  );
}