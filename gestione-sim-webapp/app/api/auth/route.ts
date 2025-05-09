import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const prisma = new PrismaClient()
const COOKIE_EXPIRY_DAYS = 7

export async function POST(req: NextRequest) {
  const { username, password } = await req.json()

  const user = await prisma.user.findUnique({
    where: { email: username },
  })

  if (!user) {
    return NextResponse.json({ error: 'Credenziali errate' }, { status: 401 })
  }

  const passwordMatch = await bcrypt.compare(password, user.password)

  if (!passwordMatch) {
    return NextResponse.json({ error: 'Credenziali errate' }, { status: 401 })
  }

  const response = NextResponse.json({ success: true })

  response.cookies.set('token', 'authenticated', {
    path: '/',
    httpOnly: true,
    maxAge: 60 * 60 * 24 * COOKIE_EXPIRY_DAYS,
    secure: process.env.NODE_ENV === 'production',
  })

  return response
}