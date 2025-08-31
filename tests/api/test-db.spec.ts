import { test, expect } from '@playwright/test'

test.describe('Database Connection API', () => {
  test('should connect to database and return valid status', async ({ request }) => {
    const response = await request.get('/api/test-db')
    
    // Should return 200 for success or 206 for partial success (when DB not set up)
    expect([200, 206]).toContain(response.status())
    
    const data = await response.json()
    expect(data.success).toBeDefined()
    expect(data.timestamp).toBeDefined()
    expect(data.database_url).toBeDefined()
    expect(data.tests).toBeDefined()
  })

  test('should have all required test results', async ({ request }) => {
    const response = await request.get('/api/test-db')
    const data = await response.json()
    
    // Check that all tests are present
    expect(data.tests).toHaveProperty('connection')
    expect(data.tests).toHaveProperty('profiles_table')
    expect(data.tests).toHaveProperty('auth_access')
    expect(data.tests).toHaveProperty('rls_enabled')
    expect(data.tests).toHaveProperty('tables_exist')
    
    // Check that all test properties are boolean or null
    expect(typeof data.tests.connection).toBe('boolean')
    expect(typeof data.tests.profiles_table).toBe('boolean')
    expect(typeof data.tests.auth_access).toBe('boolean')
    expect(typeof data.tests.rls_enabled).toBe('boolean')
    expect(data.tests.tables_exist === null || typeof data.tests.tables_exist === 'boolean').toBe(true)
  })

  test('should return database details', async ({ request }) => {
    const response = await request.get('/api/test-db')
    const data = await response.json()
    
    expect(data.details).toBeDefined()
    expect(data.details.profiles_count).toBeDefined()
    expect(typeof data.details.profiles_count).toBe('number')
    expect(typeof data.details.auth_users_accessible).toBe('boolean')
    expect(data.details.tables_with_rls).toBeDefined()
    expect(Array.isArray(data.details.tables_with_rls)).toBe(true)
  })

  test('should handle HEAD request for health check', async ({ request }) => {
    const response = await request.head('/api/test-db')
    
    // Should return 200 for successful health check or 503 if DB not available
    expect([200, 503]).toContain(response.status())
  })

  test('should return proper error handling', async ({ request }) => {
    // Test with invalid endpoint to ensure proper error handling
    const response = await request.get('/api/test-db/invalid')
    
    // Should return 404 for invalid endpoint
    expect(response.status()).toBe(404)
  })

  test('should have valid timestamp format', async ({ request }) => {
    const response = await request.get('/api/test-db')
    const data = await response.json()
    
    // Check that timestamp is a valid ISO string
    const timestamp = new Date(data.timestamp)
    expect(timestamp.getTime()).not.toBeNaN()
    expect(data.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
  })

  test('should mask database URL for security', async ({ request }) => {
    const response = await request.get('/api/test-db')
    const data = await response.json()
    
    // Check that database URL is masked
    expect(data.database_url).toContain('[REDACTED]')
    expect(data.database_url).not.toContain('supabase.co')
  })

  test('should return appropriate status based on success', async ({ request }) => {
    // This test verifies that the API returns appropriate status codes
    const response = await request.get('/api/test-db')
    const data = await response.json()
    
    // If all tests pass, status should be 200
    if (data.success) {
      expect(response.status()).toBe(200)
    } else {
      // If some tests fail, status should be 206 (partial success) or 500 (complete failure)
      expect([206, 500]).toContain(response.status())
    }
  })

  test('should have consistent response structure', async ({ request }) => {
    const response = await request.get('/api/test-db')
    const data = await response.json()
    
    // Verify response structure
    const expectedKeys = ['success', 'timestamp', 'database_url', 'tests', 'details']
    expectedKeys.forEach(key => {
      expect(data).toHaveProperty(key)
    })
    
    // Verify tests structure
    const expectedTestKeys = ['connection', 'profiles_table', 'auth_access', 'rls_enabled', 'tables_exist']
    expectedTestKeys.forEach(key => {
      expect(data.tests).toHaveProperty(key)
      expect(data.tests[key] === null || typeof data.tests[key] === 'boolean').toBe(true)
    })
    
    // Verify details structure
    const expectedDetailKeys = ['profiles_count', 'auth_users_accessible', 'tables_with_rls']
    expectedDetailKeys.forEach(key => {
      expect(data.details).toHaveProperty(key)
    })
  })

  test('should handle concurrent requests', async ({ request }) => {
    // Test multiple concurrent requests to ensure stability
    const promises = Array.from({ length: 5 }, () => 
      request.get('/api/test-db')
    )
    
    const responses = await Promise.all(promises)
    
    // All requests should return valid status codes
    responses.forEach(response => {
      expect([200, 206, 500]).toContain(response.status())
    })
    
    // All responses should have valid JSON
    const dataPromises = responses.map(response => response.json())
    const dataArray = await Promise.all(dataPromises)
    
    dataArray.forEach(data => {
      expect(data.success).toBeDefined()
      expect(data.timestamp).toBeDefined()
    })
  })
})
