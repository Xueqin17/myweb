'use client';

import { useMemo, useState } from 'react';
import styles from './FormOut.module.css';

type FormState = {
  username: string;
  token: string;    
  owner: string;
  repo: string;
};

function buildPreview(f: FormState) {
  const mask = f.token ? '******' : '<token>';               
  const u = f.username || '<username>';
  const o = f.owner || '<owner>';
  const r = f.repo || '<repository>';

  return [
    `git clone https://${u}:${mask}@github.com/${o}/${r}.git`,
    `cd ${r}`,
    `git checkout -b update-readme`,
    `echo "## This is the System" >> README.md`,
    `echo "Successfully connected!" >> README.md`,
    ``,
    `git add README.md`,
    `git commit -m "Update README.md: Add new section"`,
    `git push origin update-readme`,
    `gh pr create --title "Update README.md" --body "Added a new section to the README"`,
  ].join('\n');
}

export default function FormOut() {
  const [form, setForm] = useState<FormState>({
    username: '', token: '', owner: '', repo: '',
  });

  const preview = useMemo(() => buildPreview(form), [form]);
  const set = (k: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm({ ...form, [k]: e.target.value });

  return (
    <div className={styles.wrap} aria-label="Git commands playground">
      {/* Form */}
      <section className={styles.card}>
        <div className={styles.title}>Inputs</div>

        <label className={styles.label} htmlFor="u">Username</label>
        <input id="u" className={styles.input} placeholder="your GitHub username"
               value={form.username} onChange={set('username')} />

        <label className={styles.label} htmlFor="t">Token</label>
        <input id="t" type="password" className={styles.input}
               placeholder="personal access token"
               value={form.token} onChange={set('token')}
               autoComplete="new-password" />
        <p className={styles.note}></p>

        <label className={styles.label} htmlFor="o">Owner</label>
        <input id="o" className={styles.input}
               placeholder="repo owner"
               value={form.owner} onChange={set('owner')} />

        <label className={styles.label} htmlFor="r">Repository</label>
        <input id="r" className={styles.input} placeholder="repository name"
               value={form.repo} onChange={set('repo')} />
      </section>

      {/* Command */}
      <section className={styles.card}>
        <div className={styles.title}>Execute </div>
        <pre className={styles.pre}>{preview}</pre>
        <p className={styles.note}></p>
      </section>
    </div>
  );
}