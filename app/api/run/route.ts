import { NextResponse } from 'next/server';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const { username, token, owner, repo } = await req.json();

    if (!username || !token || !owner || !repo) {
      return NextResponse.json({ ok: false, error: 'Missing required fields' }, { status: 400 });
    }

    // Generate a unique branch name and a unique working directory
    const ts = Date.now();
    const branch = `update-readme-${ts}`;

    const workRoot = path.join(process.cwd(), '.runner');
    const runDir = path.join(workRoot, `${owner}-${repo}-${ts}`);
    fs.rmSync(runDir, { recursive: true, force: true }); 
    fs.mkdirSync(runDir, { recursive: true });

    //  Differetn platform shell
    const shell = process.platform === 'win32' ? 'cmd.exe' : '/bin/bash';
    const opts = { cwd: runDir, encoding: 'utf8' as const, stdio: 'pipe' as const, shell };

    const log: string[] = [];
    const run = (cmd: string) => {
      const out = execSync(cmd, opts).toString();
      log.push(`$ ${cmd}\n${out}`);
      return out;
    };

    // Clone to the current directory to avoid creating a fixed directory name
    run(`git clone https://${username}:${token}@github.com/${owner}/${repo}.git .`);

    // Create a unique branch, append different content, commit and push.
    run(`git switch -c ${branch}`);
    run(`echo "## This is the System (${ts})" >> README.md`);
    run(`echo "Successfully connected! (${ts})" >> README.md`);
    run(`git add README.md`);
    run(`git commit -m "Update README.md: ${ts}"`);
    run(`git push -u origin ${branch}`);

   
    try {
      run(`gh pr create --title "Update README.md ${ts}" --body "Added a new section (${ts})"`);
    } catch {
      log.push('gh not available — skipped PR creation.');
    }

    return NextResponse.json({ ok: true, output: log });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}