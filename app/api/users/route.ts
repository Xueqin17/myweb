import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; 
import { Sequelize, DataTypes } from 'sequelize';

// ==============================
// Delay initialize Sequelize（
// ==============================
let sequelize: Sequelize | null = null;
let UserModel: any = null;

function getSequelize() {
  if (!sequelize) {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: './sequelize.db',
      logging: false,
    });
    UserModel = sequelize.define('User', {
      name: { type: DataTypes.STRING, allowNull: false },
      lineStatus: { type: DataTypes.STRING, defaultValue: 'offline' },
    });
  }
  return { sequelize, UserModel };
}


const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// ==============================
// OPTIONS Pre-inspection request
// ==============================
export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

// ==============================
// GET：users
// ==============================
export async function GET(req: NextRequest) {
  try {
    const orm = req.nextUrl.searchParams.get('orm') || 'prisma';

    if (orm === 'sequelize') {
      const { sequelize, UserModel } = getSequelize();
      await sequelize.sync();
      const users = await UserModel.findAll();
      return NextResponse.json(users, { headers: corsHeaders });
    } else {
      const users = await prisma.user.findMany();
      return NextResponse.json(users, { headers: corsHeaders });
    }
  } catch (err: any) {
    console.error('GET Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders });
  }
}

// ==============================
// POST：Create user
// ==============================
export async function POST(req: NextRequest) {
  try {
    const orm = req.nextUrl.searchParams.get('orm') || 'prisma';
    const body = await req.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400, headers: corsHeaders });
    }

    if (orm === 'sequelize') {
      const { sequelize, UserModel } = getSequelize();
      await sequelize.sync();
      const user = await UserModel.create({ name });
      return NextResponse.json(user, { headers: corsHeaders });
    } else {
      const user = await prisma.user.create({
        data: { name, lineStatus: 'offline' },
      });
      return NextResponse.json(user, { headers: corsHeaders });
    }
  } catch (err: any) {
    console.error('POST Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders });
  }
}

// ==============================
// PUT：toggle（online/offline）
// ==============================
export async function PUT(req: NextRequest) {
  try {
    const orm = req.nextUrl.searchParams.get('orm') || 'prisma';
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400, headers: corsHeaders });
    }

    if (orm === 'sequelize') {
      const { sequelize, UserModel } = getSequelize();
      await sequelize.sync();
      const user = await UserModel.findByPk(id);
      if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404, headers: corsHeaders });

      user.lineStatus = user.lineStatus === 'online' ? 'offline' : 'online';
      await user.save();
      return NextResponse.json(user, { headers: corsHeaders });
    } else {
      const user = await prisma.user.findUnique({ where: { id } });
      if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404, headers: corsHeaders });

      const updated = await prisma.user.update({
        where: { id },
        data: { lineStatus: user.lineStatus === 'online' ? 'offline' : 'online' },
      });
      return NextResponse.json(updated, { headers: corsHeaders });
    }
  } catch (err: any) {
    console.error('PUT Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders });
  }
}

// ==============================
// DELETE：user
// ==============================
export async function DELETE(req: NextRequest) {
  try {
    const orm = req.nextUrl.searchParams.get('orm') || 'prisma';
    const id = req.nextUrl.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400, headers: corsHeaders });
    }

    if (orm === 'sequelize') {
      const { sequelize, UserModel } = getSequelize();
      await sequelize.sync();
      const deleted = await UserModel.destroy({ where: { id } });
      return NextResponse.json({ deleted }, { headers: corsHeaders });
    } else {
      await prisma.user.delete({ where: { id: Number(id) } });
      return NextResponse.json({ deleted: true }, { headers: corsHeaders });
    }
  } catch (err: any) {
    console.error('DELETE Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders });
  }
}