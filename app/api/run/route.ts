import { NextResponse } from 'next/server';
import { execSync } from 'child_process';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, token, owner, repo } = body;

    if (!username || !token || !owner || !repo) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Commands 
    const commands = [
      `git clone https://${username}:${token}@github.com/${owner}/${repo}.git`,
      `cd ${repo}`,
      `git checkout -b update-readme`,
      `echo "## This is the System" >> README.md`,
      `echo "Successfully connected!" >> README.md`,
      `git add README.md`,
      `git commit -m "Update README.md: Add new section"`,
      `git push origin update-readme`,
      `gh pr create --title "Update README.md" --body "Added a new section to the README"`,
    ];

    // Execute and output
    let output: string[] = [];
    for (const cmd of commands) {
      const out = execSync(cmd, { encoding: 'utf8', stdio: 'pipe', shell: 'cmd.exe'});
      output.push(`$ ${cmd}\n${out}`);
    }

    return NextResponse.json({ ok: true, output });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}