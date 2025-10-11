import { NextResponse } from 'next/server';
import { execSync } from 'child_process';

export async function POST() {
  try {
    const commands = [
      'docker build -t my-next-app .',
      'docker run --rm my-next-app',
    ];

    let output: string[] = [];
    for (const cmd of commands) {
      const out = execSync(cmd, { encoding: 'utf8', stdio: 'pipe', shell: 'cmd.exe' });
      output.push(`$ ${cmd}\n${out}`);
    }

    return NextResponse.json({ ok: true, output });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
