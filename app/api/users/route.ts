// @ts-nocheck
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import sequelize from '../../../database.js';
import User from '../../../models/user.js';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const orm = searchParams.get('orm') || 'prisma';

  try {
    if (orm === 'prisma') {
      const users = await prisma.user.findMany();
      return NextResponse.json(users);
    } else {
      await sequelize.sync();
      const users = await User.findAll();
      return NextResponse.json(users);
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);
  const orm = searchParams.get('orm') || 'prisma';
  const { name } = await req.json();

  try {
    if (orm === 'prisma') {
      await prisma.user.create({ data: { name } });
    } else {
      await sequelize.sync();
      await User.create({ name });
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const { searchParams } = new URL(req.url);
  const orm = searchParams.get('orm') || 'prisma';
  const { id } = await req.json();

  try {
    if (orm === 'prisma') {
      const user = await prisma.user.findUnique({ where: { id: Number(id) } });
      if (!user) throw new Error('User not found');
      const newStatus = user.lineStatus === 'online' ? 'offline' : 'online';
      await prisma.user.update({
        where: { id: Number(id) },
        data: { lineStatus: newStatus },
      });
    } else {
      await sequelize.sync();
      const user = await User.findByPk(id);
      if (!user) throw new Error('User not found');
      const newStatus = user.lineStatus === 'online' ? 'offline' : 'online';
      await user.update({ lineStatus: newStatus });
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const orm = searchParams.get('orm') || 'prisma';
  const idParam = searchParams.get('id'); // From URL to get User ID
  const id = idParam ? Number(idParam) : null;

  if (!id) {
    return NextResponse.json({ error: 'Missing user ID' }, { status: 400 });
  }

  try {
    if (orm === 'prisma') {
      await prisma.user.delete({ where: { id } });
    } else {
      await sequelize.sync();
      await User.destroy({ where: { id } });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Delete failed: ' + error.message }, { status: 500 });
  }
}
