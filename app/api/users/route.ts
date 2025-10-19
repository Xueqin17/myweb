// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
// CORS headers (keep it simple for demo)
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Preflight
export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

// GET: list all users
export async function GET() {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json(users, { headers: corsHeaders });
  } catch (err) {
    console.error('GET /api/users error:', err);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500, headers: corsHeaders });
  }
}

// POST: create user { name }
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    if (!body?.name || typeof body.name !== 'string') {
      return NextResponse.json({ error: 'Field "name" is required' }, { status: 400, headers: corsHeaders });
    }

    const created = await prisma.user.create({
      data: { name: body.name, lineStatus: 'offline' },
    });

    return NextResponse.json(created, { headers: corsHeaders });
  } catch (err) {
    console.error('POST /api/users error:', err);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500, headers: corsHeaders });
  }
}

// PATCH: toggle/update user by id (query), body { lineStatus }
export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const idParam = searchParams.get('id');
    if (!idParam) {
      return NextResponse.json({ error: 'Missing query param "id"' }, { status: 400, headers: corsHeaders });
    }

    const id = Number(idParam);
    if (Number.isNaN(id)) {
      return NextResponse.json({ error: '"id" must be a number' }, { status: 400, headers: corsHeaders });
    }

    const body = await request.json().catch(() => ({}));
    if (!body?.lineStatus || !['online', 'offline'].includes(body.lineStatus)) {
      return NextResponse.json({ error: '"lineStatus" must be "online" or "offline"' }, { status: 400, headers: corsHeaders });
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { lineStatus: body.lineStatus },
    });

    return NextResponse.json(updated, { headers: corsHeaders });
  } catch (err) {
    console.error('PATCH /api/users error:', err);
    return NextResponse.json({ error: 'Toggle failed' }, { status: 500, headers: corsHeaders });
  }
}

// DELETE: delete user by id (query)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const idParam = searchParams.get('id');
    if (!idParam) {
      return NextResponse.json({ error: 'Missing query param "id"' }, { status: 400, headers: corsHeaders });
    }

    const id = Number(idParam);
    if (Number.isNaN(id)) {
      return NextResponse.json({ error: '"id" must be a number' }, { status: 400, headers: corsHeaders });
    }

    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ message: 'User deleted successfully' }, { headers: corsHeaders });
  } catch (err) {
    console.error('DELETE /api/users error:', err);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500, headers: corsHeaders });
  }
}