import { NextRequest, NextResponse } from 'next/server';
import { ensureDB } from '../../../api/database/db';
import { User } from '../../../api/database/models';

export async function GET(request: NextRequest, context: any) {
  try {
    await ensureDB();
    const users = await User.findAll();
    return NextResponse.json(users);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest, context: any) {
  try {
    await ensureDB();
    const data = await request.json();
    const user = await User.create(data);
    return NextResponse.json(user, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}