import { test, expect } from '@playwright/test';
import { execSync } from 'child_process';
import fs from 'fs';

test.describe('Server Supabase Client Tests', () => {
  test('@supabase/ssr package is installed', () => {
    // Test that the package is installed
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    expect(packageJson.dependencies).toHaveProperty('@supabase/ssr');
  });

  test('supabase server client file exists', () => {
    // Test that the server client file exists
    expect(fs.existsSync('lib/supabase/server.ts')).toBe(true);
  });

  test('supabase server client file has correct imports', () => {
    // Test that the server client file has correct imports
    const serverContent = fs.readFileSync('lib/supabase/server.ts', 'utf8');
    
    expect(serverContent).toContain("import { createServerClient } from '@supabase/ssr'");
    expect(serverContent).toContain("import { cookies } from 'next/headers'");
    expect(serverContent).toContain("import { Database } from '@/types/database'");
  });

  test('supabase server client uses environment variables', () => {
    // Test that the server client uses environment variables
    const serverContent = fs.readFileSync('lib/supabase/server.ts', 'utf8');
    
    expect(serverContent).toContain('process.env.NEXT_PUBLIC_SUPABASE_URL');
    expect(serverContent).toContain('process.env.SUPABASE_SERVICE_ROLE_KEY');
  });

  test('supabase server client validates environment variables', () => {
    // Test that the server client validates environment variables
    const serverContent = fs.readFileSync('lib/supabase/server.ts', 'utf8');
    
    expect(serverContent).toContain('if (!supabaseUrl) {');
    expect(serverContent).toContain('throw new Error(\'Missing NEXT_PUBLIC_SUPABASE_URL environment variable\')');
    expect(serverContent).toContain('if (!supabaseServiceKey) {');
    expect(serverContent).toContain('throw new Error(\'Missing SUPABASE_SERVICE_ROLE_KEY environment variable\')');
  });

  test('supabase server client has createClient function', () => {
    // Test that the server client has createClient function
    const serverContent = fs.readFileSync('lib/supabase/server.ts', 'utf8');
    
    expect(serverContent).toContain('export function createClient() {');
    expect(serverContent).toContain('const cookieStore = cookies()');
    expect(serverContent).toContain('return createServerClient<Database>(supabaseUrl, supabaseServiceKey, {');
  });

  test('supabase server client has createAdminClient function', () => {
    // Test that the server client has createAdminClient function
    const serverContent = fs.readFileSync('lib/supabase/server.ts', 'utf8');
    
    expect(serverContent).toContain('export function createAdminClient() {');
    expect(serverContent).toContain('return createServerClient<Database>(supabaseUrl, supabaseServiceKey, {');
  });

  test('supabase server client has proper cookie handling', () => {
    // Test that the server client has proper cookie handling
    const serverContent = fs.readFileSync('lib/supabase/server.ts', 'utf8');
    
    expect(serverContent).toContain('cookies: {');
    expect(serverContent).toContain('getAll() {');
    expect(serverContent).toContain('return cookieStore.getAll()');
    expect(serverContent).toContain('setAll(cookiesToSet) {');
    expect(serverContent).toContain('cookieStore.set(name, value, options)');
  });

  test('supabase server client has proper error handling for cookies', () => {
    // Test that the server client has proper error handling for cookies
    const serverContent = fs.readFileSync('lib/supabase/server.ts', 'utf8');
    
    expect(serverContent).toContain('try {');
    expect(serverContent).toContain('} catch {');
    expect(serverContent).toContain('// The `setAll` method was called from a Server Component.');
    expect(serverContent).toContain('// This can be ignored if you have middleware refreshing');
    expect(serverContent).toContain('// user sessions.');
  });

  test('supabase server client has admin client cookie handling', () => {
    // Test that the server client has admin client cookie handling
    const serverContent = fs.readFileSync('lib/supabase/server.ts', 'utf8');
    
    expect(serverContent).toContain('getAll() {');
    expect(serverContent).toContain('return []');
    expect(serverContent).toContain('setAll() {');
    expect(serverContent).toContain('// No-op for admin client');
  });

  test('supabase server client has getCurrentUser helper function', () => {
    // Test that the server client has getCurrentUser helper function
    const serverContent = fs.readFileSync('lib/supabase/server.ts', 'utf8');
    
    expect(serverContent).toContain('export async function getCurrentUser() {');
    expect(serverContent).toContain('const supabase = createClient()');
    expect(serverContent).toContain('const { data: { user }, error } = await supabase.auth.getUser()');
    expect(serverContent).toContain('if (error) {');
    expect(serverContent).toContain('console.error(\'Error getting current user in server component:\', error)');
    expect(serverContent).toContain('return null');
    expect(serverContent).toContain('return user');
  });

  test('supabase server client has getCurrentSession helper function', () => {
    // Test that the server client has getCurrentSession helper function
    const serverContent = fs.readFileSync('lib/supabase/server.ts', 'utf8');
    
    expect(serverContent).toContain('export async function getCurrentSession() {');
    expect(serverContent).toContain('const supabase = createClient()');
    expect(serverContent).toContain('const { data: { session }, error } = await supabase.auth.getSession()');
    expect(serverContent).toContain('if (error) {');
    expect(serverContent).toContain('console.error(\'Error getting current session in server component:\', error)');
    expect(serverContent).toContain('return null');
    expect(serverContent).toContain('return session');
  });

  test('supabase server client has isAuthenticated helper function', () => {
    // Test that the server client has isAuthenticated helper function
    const serverContent = fs.readFileSync('lib/supabase/server.ts', 'utf8');
    
    expect(serverContent).toContain('export async function isAuthenticated() {');
    expect(serverContent).toContain('const user = await getCurrentUser()');
    expect(serverContent).toContain('return user !== null');
  });

  test('supabase server client has getUserProfile helper function', () => {
    // Test that the server client has getUserProfile helper function
    const serverContent = fs.readFileSync('lib/supabase/server.ts', 'utf8');
    
    expect(serverContent).toContain('export async function getUserProfile(userId: string) {');
    expect(serverContent).toContain('const supabase = createClient()');
    expect(serverContent).toContain('.from(\'profiles\')');
    expect(serverContent).toContain('.select(\'*\')');
    expect(serverContent).toContain('.eq(\'id\', userId)');
    expect(serverContent).toContain('.single()');
  });

  test('supabase server client has getUserHousehold helper function', () => {
    // Test that the server client has getUserHousehold helper function
    const serverContent = fs.readFileSync('lib/supabase/server.ts', 'utf8');
    
    expect(serverContent).toContain('export async function getUserHousehold(userId: string) {');
    expect(serverContent).toContain('const supabase = createClient()');
    expect(serverContent).toContain('.from(\'profiles\')');
    expect(serverContent).toContain('.select(`');
    expect(serverContent).toContain('*,');
    expect(serverContent).toContain('households (*)');
    expect(serverContent).toContain('`)');
    expect(serverContent).toContain('.eq(\'id\', userId)');
    expect(serverContent).toContain('.single()');
  });

  test('supabase server client has hasPermission helper function', () => {
    // Test that the server client has hasPermission helper function
    const serverContent = fs.readFileSync('lib/supabase/server.ts', 'utf8');
    
    expect(serverContent).toContain('export async function hasPermission(userId: string, permission: string) {');
    expect(serverContent).toContain('const profile = await getUserProfile(userId)');
    expect(serverContent).toContain('if (!profile) {');
    expect(serverContent).toContain('return false');
    expect(serverContent).toContain('return profile.role === \'admin\' || profile.permissions?.includes(permission)');
  });

  test('supabase server client exports types', () => {
    // Test that the server client exports types
    const serverContent = fs.readFileSync('lib/supabase/server.ts', 'utf8');
    
    expect(serverContent).toContain('export type { User, Session, AuthError } from \'@supabase/supabase-js\'');
    expect(serverContent).toContain('export type SupabaseClient = ReturnType<typeof createClient>');
    expect(serverContent).toContain('export type AdminClient = ReturnType<typeof createAdminClient>');
  });

  test('supabase server client has proper error handling', () => {
    // Test that the server client has proper error handling
    const serverContent = fs.readFileSync('lib/supabase/server.ts', 'utf8');
    
    expect(serverContent).toContain('try {');
    expect(serverContent).toContain('} catch (error) {');
    expect(serverContent).toContain('console.error');
    expect(serverContent).toContain('return null');
  });

  test('supabase server client has proper logging', () => {
    // Test that the server client has proper logging
    const serverContent = fs.readFileSync('lib/supabase/server.ts', 'utf8');
    
    expect(serverContent).toContain('console.error(\'Error getting current user in server component:\', error)');
    expect(serverContent).toContain('console.error(\'Error getting current session in server component:\', error)');
    expect(serverContent).toContain('console.error(\'Error getting user profile:\', error)');
    expect(serverContent).toContain('console.error(\'Error getting user household:\', error)');
    expect(serverContent).toContain('console.error(\'Unexpected error getting current user:\', error)');
    expect(serverContent).toContain('console.error(\'Unexpected error getting current session:\', error)');
    expect(serverContent).toContain('console.error(\'Unexpected error getting user profile:\', error)');
    expect(serverContent).toContain('console.error(\'Unexpected error getting user household:\', error)');
  });

  test('supabase server client has proper return types', () => {
    // Test that the server client has proper return types
    const serverContent = fs.readFileSync('lib/supabase/server.ts', 'utf8');
    
    expect(serverContent).toContain('return user');
    expect(serverContent).toContain('return session');
    expect(serverContent).toContain('return user !== null');
    expect(serverContent).toContain('return profile');
    expect(serverContent).toContain('return profile?.households');
    expect(serverContent).toContain('return false');
    expect(serverContent).toContain('return profile.role === \'admin\' || profile.permissions?.includes(permission)');
  });

  test('supabase server client has proper async/await usage', () => {
    // Test that the server client has proper async/await usage
    const serverContent = fs.readFileSync('lib/supabase/server.ts', 'utf8');
    
    expect(serverContent).toContain('await supabase.auth.getUser()');
    expect(serverContent).toContain('await supabase.auth.getSession()');
    expect(serverContent).toContain('await getCurrentUser()');
    expect(serverContent).toContain('await getUserProfile(userId)');
  });

  test('supabase server client has proper destructuring', () => {
    // Test that the server client has proper destructuring
    const serverContent = fs.readFileSync('lib/supabase/server.ts', 'utf8');
    
    expect(serverContent).toContain('const { data: { user }, error } = await supabase.auth.getUser()');
    expect(serverContent).toContain('const { data: { session }, error } = await supabase.auth.getSession()');
    expect(serverContent).toContain('const { data: profile, error } = await supabase');
  });

  test('supabase server client has proper null checks', () => {
    // Test that the server client has proper null checks
    const serverContent = fs.readFileSync('lib/supabase/server.ts', 'utf8');
    
    expect(serverContent).toContain('if (!supabaseUrl) {');
    expect(serverContent).toContain('if (!supabaseServiceKey) {');
    expect(serverContent).toContain('if (error) {');
    expect(serverContent).toContain('if (!profile) {');
    expect(serverContent).toContain('return null');
    expect(serverContent).toContain('return user !== null');
  });

  test('supabase server client has proper error messages', () => {
    // Test that the server client has proper error messages
    const serverContent = fs.readFileSync('lib/supabase/server.ts', 'utf8');
    
    expect(serverContent).toContain('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
    expect(serverContent).toContain('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
  });

  test('supabase server client has proper function structure', () => {
    // Test that the server client has proper function structure
    const serverContent = fs.readFileSync('lib/supabase/server.ts', 'utf8');
    
    expect(serverContent).toContain('export function createClient() {');
    expect(serverContent).toContain('export function createAdminClient() {');
    expect(serverContent).toContain('export async function getCurrentUser() {');
    expect(serverContent).toContain('export async function getCurrentSession() {');
    expect(serverContent).toContain('export async function isAuthenticated() {');
    expect(serverContent).toContain('export async function getUserProfile(userId: string) {');
    expect(serverContent).toContain('export async function getUserHousehold(userId: string) {');
    expect(serverContent).toContain('export async function hasPermission(userId: string, permission: string) {');
  });

  test('supabase server client has proper parameter types', () => {
    // Test that the server client has proper parameter types
    const serverContent = fs.readFileSync('lib/supabase/server.ts', 'utf8');
    
    expect(serverContent).toContain('getUserProfile(userId: string) {');
    expect(serverContent).toContain('getUserHousehold(userId: string) {');
    expect(serverContent).toContain('hasPermission(userId: string, permission: string) {');
  });

  test('supabase server client has proper database queries', () => {
    // Test that the server client has proper database queries
    const serverContent = fs.readFileSync('lib/supabase/server.ts', 'utf8');
    
    expect(serverContent).toContain('.from(\'profiles\')');
    expect(serverContent).toContain('.select(\'*\')');
    expect(serverContent).toContain('.select(`');
    expect(serverContent).toContain('*,');
    expect(serverContent).toContain('households (*)');
    expect(serverContent).toContain('`)');
    expect(serverContent).toContain('.eq(\'id\', userId)');
    expect(serverContent).toContain('.single()');
  });

  test('supabase server client has proper permission logic', () => {
    // Test that the server client has proper permission logic
    const serverContent = fs.readFileSync('lib/supabase/server.ts', 'utf8');
    
    expect(serverContent).toContain('profile.role === \'admin\'');
    expect(serverContent).toContain('profile.permissions?.includes(permission)');
  });

  test('supabase server client has proper comments', () => {
    // Test that the server client has proper comments
    const serverContent = fs.readFileSync('lib/supabase/server.ts', 'utf8');
    
    expect(serverContent).toContain('// Get environment variables');
    expect(serverContent).toContain('// Validate environment variables');
    expect(serverContent).toContain('// Create server-side Supabase client for React Server Components');
    expect(serverContent).toContain('// Create server-side Supabase client with service role for admin operations');
    expect(serverContent).toContain('// Helper function to get the current user in server components');
    expect(serverContent).toContain('// Helper function to get the current session in server components');
    expect(serverContent).toContain('// Helper function to check if user is authenticated in server components');
    expect(serverContent).toContain('// Helper function to get user profile data');
    expect(serverContent).toContain('// Helper function to get user\'s household data');
    expect(serverContent).toContain('// Helper function to check if user has specific permissions');
    expect(serverContent).toContain('// Export types for convenience');
  });

  test('supabase server client has proper try-catch blocks', () => {
    // Test that the server client has proper try-catch blocks
    const serverContent = fs.readFileSync('lib/supabase/server.ts', 'utf8');
    
    expect(serverContent).toContain('try {');
    expect(serverContent).toContain('} catch (error) {');
    expect(serverContent).toContain('console.error(\'Unexpected error getting current user:\', error)');
    expect(serverContent).toContain('console.error(\'Unexpected error getting current session:\', error)');
    expect(serverContent).toContain('console.error(\'Unexpected error getting user profile:\', error)');
    expect(serverContent).toContain('console.error(\'Unexpected error getting user household:\', error)');
  });

  test('supabase server client has proper cookie handling structure', () => {
    // Test that the server client has proper cookie handling structure
    const serverContent = fs.readFileSync('lib/supabase/server.ts', 'utf8');
    
    expect(serverContent).toContain('cookies: {');
    expect(serverContent).toContain('getAll() {');
    expect(serverContent).toContain('setAll(cookiesToSet) {');
    expect(serverContent).toContain('cookiesToSet.forEach(({ name, value, options }) =>');
    expect(serverContent).toContain('cookieStore.set(name, value, options)');
  });

  test('supabase server client has proper admin client structure', () => {
    // Test that the server client has proper admin client structure
    const serverContent = fs.readFileSync('lib/supabase/server.ts', 'utf8');
    
    expect(serverContent).toContain('export function createAdminClient() {');
    expect(serverContent).toContain('return createServerClient<Database>(supabaseUrl, supabaseServiceKey, {');
    expect(serverContent).toContain('cookies: {');
    expect(serverContent).toContain('getAll() {');
    expect(serverContent).toContain('return []');
    expect(serverContent).toContain('setAll() {');
    expect(serverContent).toContain('// No-op for admin client');
  });

  test('supabase server client has proper type exports', () => {
    // Test that the server client has proper type exports
    const serverContent = fs.readFileSync('lib/supabase/server.ts', 'utf8');
    
    expect(serverContent).toContain('export type { User, Session, AuthError } from \'@supabase/supabase-js\'');
    expect(serverContent).toContain('export type SupabaseClient = ReturnType<typeof createClient>');
    expect(serverContent).toContain('export type AdminClient = ReturnType<typeof createAdminClient>');
  });

  test('supabase server client has proper environment variable usage', () => {
    // Test that the server client has proper environment variable usage
    const serverContent = fs.readFileSync('lib/supabase/server.ts', 'utf8');
    
    expect(serverContent).toContain('process.env.NEXT_PUBLIC_SUPABASE_URL!');
    expect(serverContent).toContain('process.env.SUPABASE_SERVICE_ROLE_KEY!');
  });

  test('supabase server client has proper validation logic', () => {
    // Test that the server client has proper validation logic
    const serverContent = fs.readFileSync('lib/supabase/server.ts', 'utf8');
    
    expect(serverContent).toContain('if (!supabaseUrl) {');
    expect(serverContent).toContain('throw new Error(\'Missing NEXT_PUBLIC_SUPABASE_URL environment variable\')');
    expect(serverContent).toContain('if (!supabaseServiceKey) {');
    expect(serverContent).toContain('throw new Error(\'Missing SUPABASE_SERVICE_ROLE_KEY environment variable\')');
  });

  test('supabase server client has proper client creation', () => {
    // Test that the server client has proper client creation
    const serverContent = fs.readFileSync('lib/supabase/server.ts', 'utf8');
    
    expect(serverContent).toContain('return createServerClient<Database>(supabaseUrl, supabaseServiceKey, {');
  });

  test('supabase server client has proper cookie store usage', () => {
    // Test that the server client has proper cookie store usage
    const serverContent = fs.readFileSync('lib/supabase/server.ts', 'utf8');
    
    expect(serverContent).toContain('const cookieStore = cookies()');
    expect(serverContent).toContain('return cookieStore.getAll()');
    expect(serverContent).toContain('cookieStore.set(name, value, options)');
  });

  test('supabase server client has proper error handling in helper functions', () => {
    // Test that the server client has proper error handling in helper functions
    const serverContent = fs.readFileSync('lib/supabase/server.ts', 'utf8');
    
    // Check getCurrentUser error handling
    expect(serverContent).toContain('if (error) {');
    expect(serverContent).toContain('console.error(\'Error getting current user in server component:\', error)');
    expect(serverContent).toContain('return null');
    
    // Check getCurrentSession error handling
    expect(serverContent).toContain('console.error(\'Error getting current session in server component:\', error)');
    
    // Check getUserProfile error handling
    expect(serverContent).toContain('console.error(\'Error getting user profile:\', error)');
    
    // Check getUserHousehold error handling
    expect(serverContent).toContain('console.error(\'Error getting user household:\', error)');
  });

  test('supabase server client has proper return values', () => {
    // Test that the server client has proper return values
    const serverContent = fs.readFileSync('lib/supabase/server.ts', 'utf8');
    
    // Check getCurrentUser return
    expect(serverContent).toContain('return user');
    
    // Check getCurrentSession return
    expect(serverContent).toContain('return session');
    
    // Check isAuthenticated return
    expect(serverContent).toContain('return user !== null');
    
    // Check getUserProfile return
    expect(serverContent).toContain('return profile');
    
    // Check getUserHousehold return
    expect(serverContent).toContain('return profile?.households');
    
    // Check hasPermission return
    expect(serverContent).toContain('return false');
    expect(serverContent).toContain('return profile.role === \'admin\' || profile.permissions?.includes(permission)');
  });

  test('supabase server client has proper function calls', () => {
    // Test that the server client has proper function calls
    const serverContent = fs.readFileSync('lib/supabase/server.ts', 'utf8');
    
    expect(serverContent).toContain('await supabase.auth.getUser()');
    expect(serverContent).toContain('await supabase.auth.getSession()');
    expect(serverContent).toContain('await getCurrentUser()');
    expect(serverContent).toContain('await getUserProfile(userId)');
  });

  test('supabase server client has proper destructuring patterns', () => {
    // Test that the server client has proper destructuring patterns
    const serverContent = fs.readFileSync('lib/supabase/server.ts', 'utf8');
    
    expect(serverContent).toContain('const { data: { user }, error } = await supabase.auth.getUser()');
    expect(serverContent).toContain('const { data: { session }, error } = await supabase.auth.getSession()');
    expect(serverContent).toContain('const { data: profile, error } = await supabase');
  });

  test('supabase server client has proper null handling', () => {
    // Test that the server client has proper null handling
    const serverContent = fs.readFileSync('lib/supabase/server.ts', 'utf8');
    
    expect(serverContent).toContain('return null');
    expect(serverContent).toContain('return user !== null');
    expect(serverContent).toContain('return profile?.households');
  });

  test('supabase server client has proper boolean logic', () => {
    // Test that the server client has proper boolean logic
    const serverContent = fs.readFileSync('lib/supabase/server.ts', 'utf8');
    
    expect(serverContent).toContain('return user !== null');
    expect(serverContent).toContain('return false');
    expect(serverContent).toContain('return profile.role === \'admin\' || profile.permissions?.includes(permission)');
  });

  test('supabase server client has proper async function declarations', () => {
    // Test that the server client has proper async function declarations
    const serverContent = fs.readFileSync('lib/supabase/server.ts', 'utf8');
    
    expect(serverContent).toContain('export async function getCurrentUser() {');
    expect(serverContent).toContain('export async function getCurrentSession() {');
    expect(serverContent).toContain('export async function isAuthenticated() {');
    expect(serverContent).toContain('export async function getUserProfile(userId: string) {');
    expect(serverContent).toContain('export async function getUserHousehold(userId: string) {');
    expect(serverContent).toContain('export async function hasPermission(userId: string, permission: string) {');
  });

  test('supabase server client has proper export patterns', () => {
    // Test that the server client has proper export patterns
    const serverContent = fs.readFileSync('lib/supabase/server.ts', 'utf8');
    
    expect(serverContent).toContain('export function createClient() {');
    expect(serverContent).toContain('export function createAdminClient() {');
    expect(serverContent).toContain('export async function getCurrentUser() {');
    expect(serverContent).toContain('export async function getCurrentSession() {');
    expect(serverContent).toContain('export async function isAuthenticated() {');
    expect(serverContent).toContain('export async function getUserProfile(userId: string) {');
    expect(serverContent).toContain('export async function getUserHousehold(userId: string) {');
    expect(serverContent).toContain('export async function hasPermission(userId: string, permission: string) {');
    expect(serverContent).toContain('export type { User, Session, AuthError }');
    expect(serverContent).toContain('export type SupabaseClient = ReturnType<typeof createClient>');
    expect(serverContent).toContain('export type AdminClient = ReturnType<typeof createAdminClient>');
  });

  test('supabase server client has proper import statement', () => {
    // Test that the server client has proper import statement
    const serverContent = fs.readFileSync('lib/supabase/server.ts', 'utf8');
    
    expect(serverContent).toContain("import { createServerClient } from '@supabase/ssr'");
    expect(serverContent).toContain("import { cookies } from 'next/headers'");
    expect(serverContent).toContain("import { Database } from '@/types/database'");
  });

  test('supabase server client has proper database type usage', () => {
    // Test that the server client has proper database type usage
    const serverContent = fs.readFileSync('lib/supabase/server.ts', 'utf8');
    
    expect(serverContent).toContain('createServerClient<Database>');
  });

  test('supabase server client has proper service role key usage', () => {
    // Test that the server client has proper service role key usage
    const serverContent = fs.readFileSync('lib/supabase/server.ts', 'utf8');
    
    expect(serverContent).toContain('supabaseServiceKey');
    expect(serverContent).toContain('process.env.SUPABASE_SERVICE_ROLE_KEY');
  });

  test('supabase server client has proper cookie handling for server components', () => {
    // Test that the server client has proper cookie handling for server components
    const serverContent = fs.readFileSync('lib/supabase/server.ts', 'utf8');
    
    expect(serverContent).toContain('// The `setAll` method was called from a Server Component.');
    expect(serverContent).toContain('// This can be ignored if you have middleware refreshing');
    expect(serverContent).toContain('// user sessions.');
  });

  test('supabase server client has proper admin client no-op handling', () => {
    // Test that the server client has proper admin client no-op handling
    const serverContent = fs.readFileSync('lib/supabase/server.ts', 'utf8');
    
    expect(serverContent).toContain('// No-op for admin client');
  });

  test('supabase server client has proper permission system', () => {
    // Test that the server client has proper permission system
    const serverContent = fs.readFileSync('lib/supabase/server.ts', 'utf8');
    
    expect(serverContent).toContain('// Check user\'s role and permissions');
    expect(serverContent).toContain('// This can be expanded based on your permission system');
    expect(serverContent).toContain('profile.role === \'admin\'');
    expect(serverContent).toContain('profile.permissions?.includes(permission)');
  });

  test('supabase server client is production ready', () => {
    // Test that the server client is production ready
    const serverContent = fs.readFileSync('lib/supabase/server.ts', 'utf8');
    
    // Check for proper error handling
    expect(serverContent).toContain('if (error) {');
    expect(serverContent).toContain('throw new Error');
    
    // Check for proper logging
    expect(serverContent).toContain('console.error');
    
    // Check for proper validation
    expect(serverContent).toContain('if (!supabaseUrl) {');
    expect(serverContent).toContain('if (!supabaseServiceKey) {');
    
    // Check for proper configuration
    expect(serverContent).toContain('createServerClient<Database>');
  });

  test('supabase server client follows best practices', () => {
    // Test that the server client follows best practices
    const serverContent = fs.readFileSync('lib/supabase/server.ts', 'utf8');
    
    // Check for proper TypeScript usage
    expect(serverContent).toContain('export type {');
    expect(serverContent).toContain('async function');
    
    // Check for proper error handling
    expect(serverContent).toContain('if (error) {');
    expect(serverContent).toContain('throw new Error');
    
    // Check for proper async/await usage
    expect(serverContent).toContain('await supabase.auth');
    
    // Check for proper destructuring
    expect(serverContent).toContain('const { data: { user }, error }');
    expect(serverContent).toContain('const { data: { session }, error }');
    expect(serverContent).toContain('const { data: profile, error }');
  });

  test('supabase server client has comprehensive functionality', () => {
    // Test that the server client has comprehensive functionality
    const serverContent = fs.readFileSync('lib/supabase/server.ts', 'utf8');
    
    // Check for all required functions
    expect(serverContent).toContain('createClient');
    expect(serverContent).toContain('createAdminClient');
    expect(serverContent).toContain('getCurrentUser');
    expect(serverContent).toContain('getCurrentSession');
    expect(serverContent).toContain('isAuthenticated');
    expect(serverContent).toContain('getUserProfile');
    expect(serverContent).toContain('getUserHousehold');
    expect(serverContent).toContain('hasPermission');
    
    // Check for proper auth methods
    expect(serverContent).toContain('supabase.auth.getUser()');
    expect(serverContent).toContain('supabase.auth.getSession()');
    
    // Check for proper database queries
    expect(serverContent).toContain('.from(\'profiles\')');
    expect(serverContent).toContain('.select(\'*\')');
    expect(serverContent).toContain('.eq(\'id\', userId)');
    expect(serverContent).toContain('.single()');
  });
});
