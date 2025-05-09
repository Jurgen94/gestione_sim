import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_PATHS = ['/login', '/api/auth']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Consenti accesso alle rotte pubbliche
  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next()
  }

  // Recupera cookie JWT
  const token = request.cookies.get('token')?.value

  if (!token) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // Altrimenti consenti l'accesso
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next|favicon.ico|static|public).*)'],
}