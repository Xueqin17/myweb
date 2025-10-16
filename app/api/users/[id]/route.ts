import { NextRequest, NextResponse } from 'next/server';
import { ensureDB } from '../../../../api/database/db';
import { User } from '../../../../api/database/models';

export async function GET(request: NextRequest, context: any) {
  try {
    await ensureDB();

    const id = Number(context?.params?.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}