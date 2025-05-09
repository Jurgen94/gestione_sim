import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Credenziali statiche (da sostituire con DB in futuro)
const VALID_USER = 'admin'
const VALID_PASS = 'password123'

// Tempo di validità del cookie (7 giorni)
const COOKIE_EXPIRY_DAYS = 7

export async function POST(req: NextRequest) {
  const { username, password } = await req.json()

  if (username === VALID_USER && password === VALID_PASS) {
    const response = NextResponse.json({ success: true })

    // Imposta cookie firmato
    response.cookies.set('token', 'authenticated', {
      path: '/',
      httpOnly: true,
      maxAge: 60 * 60 * 24 * COOKIE_EXPIRY_DAYS,
      secure: process.env.NODE_ENV === 'production',
    })

    return response
  }

  return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
}