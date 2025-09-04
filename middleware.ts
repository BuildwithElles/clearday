import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from '@/types/database'

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export async function middleware(request: NextRequest) {
  // Create a response object to mutate
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Create a Supabase client configured to use cookies
  const supabase = createServerClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Get the current user session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Define protected routes that require authentication
  const protectedRoutes = ['/today', '/calendar', '/tasks', '/habits', '/progress', '/settings']

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  )

  // If accessing a protected route without authentication, redirect to login
  if (isProtectedRoute && !session) {
    const redirectUrl = new URL('/login', request.url)
    // Add the original URL as a query parameter so we can redirect back after login
    redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Define auth routes that authenticated users shouldn't access
  const authRoutes = ['/login', '/signup']

  // If authenticated user tries to access auth routes, redirect to dashboard
  if (session && authRoutes.some(route => request.nextUrl.pathname === route)) {
    return NextResponse.redirect(new URL('/today', request.url))
  }

  // Allow the request to continue
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes (handled separately)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
  ],
}
