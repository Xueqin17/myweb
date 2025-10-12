import { NextResponse } from 'next/server';
import { execSync } from 'child_process';

export async function POST() {
  try {
    const output = execSync('docker build -t my-next-app .', {
      cwd: process.cwd(),
      encoding: 'utf-8',
    });

    return NextResponse.json({ success: true, output });
  } catch (err: any) {
    return NextResponse.json({ success: false, output: err.message }, { status: 500 });
  }
}
