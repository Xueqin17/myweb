// @ts-nocheck
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { Sequelize, DataTypes } from 'sequelize'


// Initialize Prisma client (for ORM = prisma)
const prisma = new PrismaClient()

// Initialize Sequelize client (for ORM = sequelize)
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './dev.db',
})

// Define Sequelize User model
const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING },
  lineStatus: { type: DataTypes.STRING, defaultValue: 'offline' },
})

// Ensure Sequelize table exists
await sequelize.sync()

// Helper function to choose ORM based on URL query
function getORM(searchParams: URLSearchParams) {
  const orm = searchParams.get('orm')
  return orm === 'sequelize' ? 'sequelize' : 'prisma'
}

// GET: Fetch all users
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const orm = getORM(searchParams)

    let users
    if (orm === 'prisma') {
      users = await prisma.user.findMany()
    } else {
      users = await User.findAll()
    }

    return NextResponse.json(users)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST: Add a new user
export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const orm = getORM(searchParams)
    const data = await req.json()
    const { name } = data

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    let newUser
    if (orm === 'prisma') {
      newUser = await prisma.user.create({
        data: { name, lineStatus: 'offline' },
      })
    } else {
      newUser = await User.create({ name, lineStatus: 'offline' })
    }

    return NextResponse.json(newUser)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT: Toggle user online/offline
export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const orm = getORM(searchParams)
    const data = await req.json()
    const { id } = data

    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    let user
    if (orm === 'prisma') {
      user = await prisma.user.findUnique({ where: { id: Number(id) } })
      if (!user) throw new Error('User not found')
      const newStatus = user.lineStatus === 'online' ? 'offline' : 'online'
      await prisma.user.update({ where: { id: Number(id) }, data: { lineStatus: newStatus } })
    } else {
      user = await User.findByPk(id)
      if (!user) throw new Error('User not found')
      const newStatus = user.lineStatus === 'online' ? 'offline' : 'online'
      await user.update({ lineStatus: newStatus })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE: Remove a user
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const orm = getORM(searchParams)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    if (orm === 'prisma') {
      await prisma.user.delete({ where: { id: Number(id) } })
    } else {
      const user = await User.findByPk(id)
      if (user) await user.destroy()
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}