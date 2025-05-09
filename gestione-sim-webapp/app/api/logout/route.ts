import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const res = NextResponse.redirect(new URL('/login', req.url))

  // Cancella il cookie "token"
  res.cookies.set('token', '', {
    path: '/',
    maxAge: 0,
  })

  return res
}