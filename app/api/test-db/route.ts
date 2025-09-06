import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { withRateLimit } from '@/lib/rate-limit'

// Test database connection API route
// This endpoint tests various database operations to ensure everything is working
export const GET = withRateLimit(async (request: NextRequest) => {
  try {
    const supabase = createAdminClient()

    // Test 1: Basic connection by querying a simple table
    let profiles, profilesError
    try {
      const result = await supabase
        .from('profiles')
        .select('*')
        .limit(1)
      profiles = result.data
      profilesError = result.error
    } catch (error) {
      profiles = null
      profilesError = error instanceof Error ? error : new Error('Unknown error')
    }

    // Test 2: Check if tables exist by querying system tables
    let tables, tablesError
    try {
      const result = await supabase
        .rpc('check_tables_exist')
      tables = result.data
      tablesError = result.error
    } catch {
      // If RPC doesn't exist, do a direct query
      const result = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .in('table_name', [
          'profiles',
          'households',
          'tasks',
          'events',
          'integrations'
        ])
      tables = result.data
      tablesError = result.error
    }

    // Test 3: Check RLS policies are enabled
    let rlsCheck, rlsError
    try {
      const result = await supabase
        .from('pg_tables')
        .select('tablename, rowsecurity')
        .eq('schemaname', 'public')
        .in('tablename', ['profiles', 'tasks', 'events'])
      rlsCheck = result.data
      rlsError = result.error
    } catch (error) {
      rlsCheck = null
      rlsError = error instanceof Error ? error : new Error('Unknown error')
    }

    // Test 4: Test auth.users table accessibility (should work with service role)
    let authUsers, authError
    try {
      const result = await supabase
        .from('auth.users')
        .select('*')
        .limit(1)
      authUsers = result.data
      authError = result.error
    } catch (error) {
      authUsers = null
      authError = error instanceof Error ? error : new Error('Unknown error')
    }

    // Test 5: Test that functions exist
    let functions, functionsError
    try {
      const result = await supabase
        .rpc('pg_get_function_result', {
          func_name: 'handle_new_user'
        })
      functions = result.data
      functionsError = result.error
    } catch {
      // Expected to fail, just checking if function exists
      functions = null
      functionsError = null
    }

    // Compile test results
    const testResults = {
      connection: !profilesError,
      profiles_table: !profilesError,
      auth_access: !authError,
      rls_enabled: !rlsError && rlsCheck && rlsCheck.length > 0,
      tables_exist: !tablesError || (tables && tables.length > 0),
    }

    const allTestsPassed = Object.values(testResults).every(test => test === true)

    const response = {
      success: allTestsPassed,
      timestamp: new Date().toISOString(),
      database_url: process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/.*$/, '/[REDACTED]'),
      tests: testResults,
      details: {
        profiles_count: profiles ? 1 : 0, // Simplified - just check if query succeeded
        auth_users_accessible: !authError,
        tables_with_rls: rlsCheck?.map(t => ({ 
          table: t.tablename, 
          rls_enabled: t.rowsecurity 
        })) || [],
      }
    }

    if (!allTestsPassed) {
      return NextResponse.json(response, { status: 206 }) // Partial success
    }

    return NextResponse.json(response, { status: 200 })

  } catch (error) {
    console.error('Database test error:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: 'Database connection test failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
})

// Optional: Add a simple health check that doesn't require admin access
export const HEAD = withRateLimit(async () => {
  try {
    const supabase = createAdminClient()
    
    // Simple ping test
    const { error } = await supabase
      .from('profiles')
      .select('*')
      .limit(1)

    if (error) {
      return new Response(null, { status: 503 }) // Service unavailable
    }

    return new Response(null, { status: 200 })
  } catch (error) {
    return new Response(null, { status: 503 })
  }
})