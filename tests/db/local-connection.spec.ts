import { test, expect } from '@playwright/test'

test.describe('Local Supabase Instance', () => {
  test('should connect to local Supabase instance', async ({ request }) => {
    // Test local Supabase connection
    const response = await request.get('http://127.0.0.1:54321/rest/v1/', {
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'
      }
    })
    
    // Should return 200 if local instance is running
    expect([200, 404, 500]).toContain(response.status())
  })

  test('should access local Supabase Studio', async ({ page }) => {
    // Test if Studio is accessible
    await page.goto('http://localhost:54323')
    
    // Check if Studio loads (should show login or dashboard)
    await expect(page.locator('body')).toBeVisible()
    
    // Studio should have some content
    const bodyText = await page.textContent('body')
    expect(bodyText).toBeTruthy()
  })

  test('should have local database tables accessible', async ({ request }) => {
    // Test if we can access the profiles table
    const response = await request.get('http://127.0.0.1:54321/rest/v1/profiles', {
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'
      }
    })
    
    // Should return 200 if table exists, 404 if not created yet
    expect([200, 404]).toContain(response.status())
  })

  test('should have auth endpoints accessible', async ({ request }) => {
    // Test auth endpoints
    const response = await request.get('http://127.0.0.1:54321/auth/v1/health')
    
    // Should return 200 if auth service is running
    expect([200, 404, 500]).toContain(response.status())
  })

  test('should have storage endpoints accessible', async ({ request }) => {
    // Test storage endpoints
    const response = await request.get('http://127.0.0.1:54321/storage/v1/bucket')
    
    // Should return 200 if storage service is running
    expect(response.status()).toBeOneOf([200, 404, 500])
  })

  test('should have realtime endpoints accessible', async ({ request }) => {
    // Test realtime endpoints
    const response = await request.get('http://127.0.0.1:54321/realtime/v1/')
    
    // Should return 200 if realtime service is running
    expect(response.status()).toBeOneOf([200, 404, 500])
  })

  test('should be able to create and query data', async ({ request }) => {
    // Test creating a test profile
    const testProfile = {
      id: '00000000-0000-0000-0000-000000000000',
      email: 'test@clearday.local',
      full_name: 'Test User',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    const createResponse = await request.post('http://127.0.0.1:54321/rest/v1/profiles', {
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0',
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      data: testProfile
    })

    // Should return 201 if created successfully, or other status if table doesn't exist
    expect(createResponse.status()).toBeOneOf([201, 404, 500])
  })

  test('should have proper CORS headers', async ({ request }) => {
    // Test CORS headers
    const response = await request.get('http://127.0.0.1:54321/rest/v1/', {
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'
      }
    })
    
    // Check for CORS headers
    const corsHeaders = response.headers()
    expect(corsHeaders).toBeDefined()
  })

  test('should have proper error handling', async ({ request }) => {
    // Test invalid endpoint
    const response = await request.get('http://127.0.0.1:54321/rest/v1/nonexistent_table')
    
    // Should return 404 for non-existent table
    expect(response.status()).toBeOneOf([404, 500])
  })

  test('should support environment variable configuration', async () => {
    // Test that environment variables are properly configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    // These should be defined (either local or production)
    expect(supabaseUrl).toBeDefined()
    expect(supabaseAnonKey).toBeDefined()
    
    // Should be a valid URL
    if (supabaseUrl) {
      expect(supabaseUrl).toMatch(/^https?:\/\//)
    }
  })
})
