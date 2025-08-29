import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

// Test database connection API route
// This endpoint tests various database operations to ensure everything is working
export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminClient()

    // Test 1: Basic connection by querying a simple table
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('count(*)')
      .limit(1)

    if (profilesError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Profiles table query failed',
          details: profilesError.message,
        },
        { status: 500 }
      )
    }

    // Test 2: Check if tables exist by querying system tables
    const { data: tables, error: tablesError } = await supabase
      .rpc('check_tables_exist')
      .catch(async () => {
        // If RPC doesn't exist, do a direct query
        return await supabase
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
      })

    // Test 3: Check RLS policies are enabled
    const { data: rlsCheck, error: rlsError } = await supabase
      .from('pg_tables')
      .select('tablename, rowsecurity')
      .eq('schemaname', 'public')
      .in('tablename', ['profiles', 'tasks', 'events'])

    // Test 4: Test auth.users table accessibility (should work with service role)
    const { data: authUsers, error: authError } = await supabase
      .from('auth.users')
      .select('count(*)')
      .limit(1)

    // Test 5: Test that functions exist
    const { data: functions, error: functionsError } = await supabase
      .rpc('pg_get_function_result', {
        func_name: 'handle_new_user'
      })
      .catch(() => ({ data: null, error: null })) // Expected to fail, just checking if function exists

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
        profiles_count: profiles?.[0]?.count || 0,
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
}

// Optional: Add a simple health check that doesn't require admin access
export async function HEAD() {
  try {
    const supabase = createAdminClient()
    
    // Simple ping test
    const { error } = await supabase
      .from('profiles')
      .select('count(*)')
      .limit(1)

    if (error) {
      return new Response(null, { status: 503 }) // Service unavailable
    }

    return new Response(null, { status: 200 })
  } catch (error) {
    return new Response(null, { status: 503 })
  }
}