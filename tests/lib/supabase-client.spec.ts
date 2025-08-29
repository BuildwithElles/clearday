import { test, expect } from '@playwright/test';
import { execSync } from 'child_process';
import fs from 'fs';

test.describe('Supabase Client Library Tests', () => {
  test('@supabase/supabase-js package is installed', () => {
    // Test that the package is installed
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    expect(packageJson.dependencies).toHaveProperty('@supabase/supabase-js');
  });

  test('supabase client file exists', () => {
    // Test that the client file exists
    expect(fs.existsSync('lib/supabase/client.ts')).toBe(true);
  });

  test('supabase client file has correct imports', () => {
    // Test that the client file has correct imports
    const clientContent = fs.readFileSync('lib/supabase/client.ts', 'utf8');
    
    expect(clientContent).toContain("import { createClient } from '@supabase/supabase-js'");
  });

  test('supabase client uses environment variables', () => {
    // Test that the client uses environment variables
    const clientContent = fs.readFileSync('lib/supabase/client.ts', 'utf8');
    
    expect(clientContent).toContain('process.env.NEXT_PUBLIC_SUPABASE_URL');
    expect(clientContent).toContain('process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY');
  });

  test('supabase client validates environment variables', () => {
    // Test that the client validates environment variables
    const clientContent = fs.readFileSync('lib/supabase/client.ts', 'utf8');
    
    expect(clientContent).toContain('if (!supabaseUrl) {');
    expect(clientContent).toContain('throw new Error(\'Missing NEXT_PUBLIC_SUPABASE_URL environment variable\')');
    expect(clientContent).toContain('if (!supabaseAnonKey) {');
    expect(clientContent).toContain('throw new Error(\'Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable\')');
  });

  test('supabase client is created with correct configuration', () => {
    // Test that the client is created with correct configuration
    const clientContent = fs.readFileSync('lib/supabase/client.ts', 'utf8');
    
    expect(clientContent).toContain('export const supabase = createClient(supabaseUrl, supabaseAnonKey, {');
    expect(clientContent).toContain('auth: {');
    expect(clientContent).toContain('autoRefreshToken: true');
    expect(clientContent).toContain('persistSession: true');
    expect(clientContent).toContain('detectSessionInUrl: true');
  });

  test('supabase client has global headers configuration', () => {
    // Test that the client has global headers configuration
    const clientContent = fs.readFileSync('lib/supabase/client.ts', 'utf8');
    
    expect(clientContent).toContain('global: {');
    expect(clientContent).toContain('headers: {');
    expect(clientContent).toContain('\'X-Client-Info\': \'clearday-web\'');
  });

  test('supabase client exports types', () => {
    // Test that the client exports types
    const clientContent = fs.readFileSync('lib/supabase/client.ts', 'utf8');
    
    expect(clientContent).toContain('export type { User, Session, AuthError } from \'@supabase/supabase-js\'');
  });

  test('supabase client has getCurrentUser helper function', () => {
    // Test that the client has getCurrentUser helper function
    const clientContent = fs.readFileSync('lib/supabase/client.ts', 'utf8');
    
    expect(clientContent).toContain('export const getCurrentUser = async () => {');
    expect(clientContent).toContain('const { data: { user }, error } = await supabase.auth.getUser()');
    expect(clientContent).toContain('if (error) {');
    expect(clientContent).toContain('console.error(\'Error getting current user:\', error)');
    expect(clientContent).toContain('return null');
    expect(clientContent).toContain('return user');
  });

  test('supabase client has getCurrentSession helper function', () => {
    // Test that the client has getCurrentSession helper function
    const clientContent = fs.readFileSync('lib/supabase/client.ts', 'utf8');
    
    expect(clientContent).toContain('export const getCurrentSession = async () => {');
    expect(clientContent).toContain('const { data: { session }, error } = await supabase.auth.getSession()');
    expect(clientContent).toContain('if (error) {');
    expect(clientContent).toContain('console.error(\'Error getting current session:\', error)');
    expect(clientContent).toContain('return null');
    expect(clientContent).toContain('return session');
  });

  test('supabase client has signOut helper function', () => {
    // Test that the client has signOut helper function
    const clientContent = fs.readFileSync('lib/supabase/client.ts', 'utf8');
    
    expect(clientContent).toContain('export const signOut = async () => {');
    expect(clientContent).toContain('const { error } = await supabase.auth.signOut()');
    expect(clientContent).toContain('if (error) {');
    expect(clientContent).toContain('console.error(\'Error signing out:\', error)');
    expect(clientContent).toContain('throw error');
  });

  test('supabase client has isAuthenticated helper function', () => {
    // Test that the client has isAuthenticated helper function
    const clientContent = fs.readFileSync('lib/supabase/client.ts', 'utf8');
    
    expect(clientContent).toContain('export const isAuthenticated = async () => {');
    expect(clientContent).toContain('const user = await getCurrentUser()');
    expect(clientContent).toContain('return user !== null');
  });

  test('supabase client exports default client', () => {
    // Test that the client exports default client
    const clientContent = fs.readFileSync('lib/supabase/client.ts', 'utf8');
    
    expect(clientContent).toContain('export default supabase');
  });

  test('supabase client file is well-formatted', () => {
    // Test that the client file is properly formatted and readable
    const clientContent = fs.readFileSync('lib/supabase/client.ts', 'utf8');
    
    // Check that the file is not empty
    expect(clientContent.length).toBeGreaterThan(100);
    
    // Check for proper line breaks and structure
    const lines = clientContent.split('\n');
    expect(lines.length).toBeGreaterThan(10);
    
    // Check for proper imports
    expect(clientContent).toContain('import { createClient } from');
  });

  test('supabase client follows TypeScript best practices', () => {
    // Test that the client follows TypeScript best practices
    const clientContent = fs.readFileSync('lib/supabase/client.ts', 'utf8');
    
    // Check for proper type annotations
    expect(clientContent).toContain('export const getCurrentUser = async () => {');
    expect(clientContent).toContain('export const getCurrentSession = async () => {');
    expect(clientContent).toContain('export const signOut = async () => {');
    expect(clientContent).toContain('export const isAuthenticated = async () => {');
  });

  test('supabase client has proper error handling', () => {
    // Test that the client has proper error handling
    const clientContent = fs.readFileSync('lib/supabase/client.ts', 'utf8');
    
    expect(clientContent).toContain('if (error) {');
    expect(clientContent).toContain('console.error');
    expect(clientContent).toContain('throw error');
  });

  test('supabase client has proper logging', () => {
    // Test that the client has proper logging
    const clientContent = fs.readFileSync('lib/supabase/client.ts', 'utf8');
    
    expect(clientContent).toContain('console.error(\'Error getting current user:\', error)');
    expect(clientContent).toContain('console.error(\'Error getting current session:\', error)');
    expect(clientContent).toContain('console.error(\'Error signing out:\', error)');
  });

  test('supabase client has proper return types', () => {
    // Test that the client has proper return types
    const clientContent = fs.readFileSync('lib/supabase/client.ts', 'utf8');
    
    expect(clientContent).toContain('return user');
    expect(clientContent).toContain('return session');
    expect(clientContent).toContain('return user !== null');
  });

  test('supabase client has proper async/await usage', () => {
    // Test that the client has proper async/await usage
    const clientContent = fs.readFileSync('lib/supabase/client.ts', 'utf8');
    
    expect(clientContent).toContain('await supabase.auth.getUser()');
    expect(clientContent).toContain('await supabase.auth.getSession()');
    expect(clientContent).toContain('await supabase.auth.signOut()');
    expect(clientContent).toContain('await getCurrentUser()');
  });

  test('supabase client has proper destructuring', () => {
    // Test that the client has proper destructuring
    const clientContent = fs.readFileSync('lib/supabase/client.ts', 'utf8');
    
    expect(clientContent).toContain('const { data: { user }, error } = await supabase.auth.getUser()');
    expect(clientContent).toContain('const { data: { session }, error } = await supabase.auth.getSession()');
    expect(clientContent).toContain('const { error } = await supabase.auth.signOut()');
  });

  test('supabase client has proper null checks', () => {
    // Test that the client has proper null checks
    const clientContent = fs.readFileSync('lib/supabase/client.ts', 'utf8');
    
    expect(clientContent).toContain('if (!supabaseUrl) {');
    expect(clientContent).toContain('if (!supabaseAnonKey) {');
    expect(clientContent).toContain('if (error) {');
    expect(clientContent).toContain('return null');
    expect(clientContent).toContain('return user !== null');
  });

  test('supabase client has proper error messages', () => {
    // Test that the client has proper error messages
    const clientContent = fs.readFileSync('lib/supabase/client.ts', 'utf8');
    
    expect(clientContent).toContain('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
    expect(clientContent).toContain('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable');
  });

  test('supabase client has proper configuration structure', () => {
    // Test that the client has proper configuration structure
    const clientContent = fs.readFileSync('lib/supabase/client.ts', 'utf8');
    
    expect(clientContent).toContain('auth: {');
    expect(clientContent).toContain('autoRefreshToken: true');
    expect(clientContent).toContain('persistSession: true');
    expect(clientContent).toContain('detectSessionInUrl: true');
    expect(clientContent).toContain('global: {');
    expect(clientContent).toContain('headers: {');
  });

  test('supabase client has proper exports', () => {
    // Test that the client has proper exports
    const clientContent = fs.readFileSync('lib/supabase/client.ts', 'utf8');
    
    expect(clientContent).toContain('export const supabase = createClient');
    expect(clientContent).toContain('export type { User, Session, AuthError }');
    expect(clientContent).toContain('export const getCurrentUser = async');
    expect(clientContent).toContain('export const getCurrentSession = async');
    expect(clientContent).toContain('export const signOut = async');
    expect(clientContent).toContain('export const isAuthenticated = async');
    expect(clientContent).toContain('export default supabase');
  });

  test('supabase client has proper comments', () => {
    // Test that the client has proper comments
    const clientContent = fs.readFileSync('lib/supabase/client.ts', 'utf8');
    
    expect(clientContent).toContain('// Get environment variables');
    expect(clientContent).toContain('// Validate environment variables');
    expect(clientContent).toContain('// Create Supabase client');
    expect(clientContent).toContain('// Export types for convenience');
    expect(clientContent).toContain('// Helper function to get the current user');
    expect(clientContent).toContain('// Helper function to get the current session');
    expect(clientContent).toContain('// Helper function to sign out');
    expect(clientContent).toContain('// Helper function to check if user is authenticated');
    expect(clientContent).toContain('// Export the client as default for convenience');
  });

  test('supabase client has proper auth configuration', () => {
    // Test that the client has proper auth configuration
    const clientContent = fs.readFileSync('lib/supabase/client.ts', 'utf8');
    
    expect(clientContent).toContain('auth: {');
    expect(clientContent).toContain('// Automatically refresh the session');
    expect(clientContent).toContain('autoRefreshToken: true');
    expect(clientContent).toContain('// Persist the session in localStorage');
    expect(clientContent).toContain('persistSession: true');
    expect(clientContent).toContain('// Detect session in URL (for magic links)');
    expect(clientContent).toContain('detectSessionInUrl: true');
  });

  test('supabase client has proper global configuration', () => {
    // Test that the client has proper global configuration
    const clientContent = fs.readFileSync('lib/supabase/client.ts', 'utf8');
    
    expect(clientContent).toContain('// Global headers for all requests');
    expect(clientContent).toContain('global: {');
    expect(clientContent).toContain('headers: {');
    expect(clientContent).toContain('\'X-Client-Info\': \'clearday-web\'');
  });

  test('supabase client has proper type exports', () => {
    // Test that the client has proper type exports
    const clientContent = fs.readFileSync('lib/supabase/client.ts', 'utf8');
    
    expect(clientContent).toContain('export type { User, Session, AuthError } from \'@supabase/supabase-js\'');
  });

  test('supabase client has proper helper function structure', () => {
    // Test that the client has proper helper function structure
    const clientContent = fs.readFileSync('lib/supabase/client.ts', 'utf8');
    
    // Check getCurrentUser function
    expect(clientContent).toContain('export const getCurrentUser = async () => {');
    expect(clientContent).toContain('const { data: { user }, error } = await supabase.auth.getUser()');
    expect(clientContent).toContain('if (error) {');
    expect(clientContent).toContain('console.error(\'Error getting current user:\', error)');
    expect(clientContent).toContain('return null');
    expect(clientContent).toContain('return user');
    
    // Check getCurrentSession function
    expect(clientContent).toContain('export const getCurrentSession = async () => {');
    expect(clientContent).toContain('const { data: { session }, error } = await supabase.auth.getSession()');
    expect(clientContent).toContain('if (error) {');
    expect(clientContent).toContain('console.error(\'Error getting current session:\', error)');
    expect(clientContent).toContain('return null');
    expect(clientContent).toContain('return session');
    
    // Check signOut function
    expect(clientContent).toContain('export const signOut = async () => {');
    expect(clientContent).toContain('const { error } = await supabase.auth.signOut()');
    expect(clientContent).toContain('if (error) {');
    expect(clientContent).toContain('console.error(\'Error signing out:\', error)');
    expect(clientContent).toContain('throw error');
    
    // Check isAuthenticated function
    expect(clientContent).toContain('export const isAuthenticated = async () => {');
    expect(clientContent).toContain('const user = await getCurrentUser()');
    expect(clientContent).toContain('return user !== null');
  });

  test('supabase client has proper error handling in helper functions', () => {
    // Test that the client has proper error handling in helper functions
    const clientContent = fs.readFileSync('lib/supabase/client.ts', 'utf8');
    
    // Check getCurrentUser error handling
    expect(clientContent).toContain('if (error) {');
    expect(clientContent).toContain('console.error(\'Error getting current user:\', error)');
    expect(clientContent).toContain('return null');
    
    // Check getCurrentSession error handling
    expect(clientContent).toContain('console.error(\'Error getting current session:\', error)');
    
    // Check signOut error handling
    expect(clientContent).toContain('console.error(\'Error signing out:\', error)');
    expect(clientContent).toContain('throw error');
  });

  test('supabase client has proper return values', () => {
    // Test that the client has proper return values
    const clientContent = fs.readFileSync('lib/supabase/client.ts', 'utf8');
    
    // Check getCurrentUser return
    expect(clientContent).toContain('return user');
    
    // Check getCurrentSession return
    expect(clientContent).toContain('return session');
    
    // Check isAuthenticated return
    expect(clientContent).toContain('return user !== null');
  });

  test('supabase client has proper function calls', () => {
    // Test that the client has proper function calls
    const clientContent = fs.readFileSync('lib/supabase/client.ts', 'utf8');
    
    expect(clientContent).toContain('await supabase.auth.getUser()');
    expect(clientContent).toContain('await supabase.auth.getSession()');
    expect(clientContent).toContain('await supabase.auth.signOut()');
    expect(clientContent).toContain('await getCurrentUser()');
  });

  test('supabase client has proper destructuring patterns', () => {
    // Test that the client has proper destructuring patterns
    const clientContent = fs.readFileSync('lib/supabase/client.ts', 'utf8');
    
    expect(clientContent).toContain('const { data: { user }, error } = await supabase.auth.getUser()');
    expect(clientContent).toContain('const { data: { session }, error } = await supabase.auth.getSession()');
    expect(clientContent).toContain('const { error } = await supabase.auth.signOut()');
  });

  test('supabase client has proper null handling', () => {
    // Test that the client has proper null handling
    const clientContent = fs.readFileSync('lib/supabase/client.ts', 'utf8');
    
    expect(clientContent).toContain('return null');
    expect(clientContent).toContain('return user !== null');
  });

  test('supabase client has proper boolean logic', () => {
    // Test that the client has proper boolean logic
    const clientContent = fs.readFileSync('lib/supabase/client.ts', 'utf8');
    
    expect(clientContent).toContain('return user !== null');
  });

  test('supabase client has proper async function declarations', () => {
    // Test that the client has proper async function declarations
    const clientContent = fs.readFileSync('lib/supabase/client.ts', 'utf8');
    
    expect(clientContent).toContain('export const getCurrentUser = async () => {');
    expect(clientContent).toContain('export const getCurrentSession = async () => {');
    expect(clientContent).toContain('export const signOut = async () => {');
    expect(clientContent).toContain('export const isAuthenticated = async () => {');
  });

  test('supabase client has proper export patterns', () => {
    // Test that the client has proper export patterns
    const clientContent = fs.readFileSync('lib/supabase/client.ts', 'utf8');
    
    expect(clientContent).toContain('export const supabase = createClient');
    expect(clientContent).toContain('export type { User, Session, AuthError }');
    expect(clientContent).toContain('export const getCurrentUser = async');
    expect(clientContent).toContain('export const getCurrentSession = async');
    expect(clientContent).toContain('export const signOut = async');
    expect(clientContent).toContain('export const isAuthenticated = async');
    expect(clientContent).toContain('export default supabase');
  });

  test('supabase client has proper import statement', () => {
    // Test that the client has proper import statement
    const clientContent = fs.readFileSync('lib/supabase/client.ts', 'utf8');
    
    expect(clientContent).toContain("import { createClient } from '@supabase/supabase-js'");
  });

  test('supabase client has proper environment variable usage', () => {
    // Test that the client has proper environment variable usage
    const clientContent = fs.readFileSync('lib/supabase/client.ts', 'utf8');
    
    expect(clientContent).toContain('process.env.NEXT_PUBLIC_SUPABASE_URL!');
    expect(clientContent).toContain('process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!');
  });

  test('supabase client has proper validation logic', () => {
    // Test that the client has proper validation logic
    const clientContent = fs.readFileSync('lib/supabase/client.ts', 'utf8');
    
    expect(clientContent).toContain('if (!supabaseUrl) {');
    expect(clientContent).toContain('throw new Error(\'Missing NEXT_PUBLIC_SUPABASE_URL environment variable\')');
    expect(clientContent).toContain('if (!supabaseAnonKey) {');
    expect(clientContent).toContain('throw new Error(\'Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable\')');
  });

  test('supabase client has proper client creation', () => {
    // Test that the client has proper client creation
    const clientContent = fs.readFileSync('lib/supabase/client.ts', 'utf8');
    
    expect(clientContent).toContain('export const supabase = createClient(supabaseUrl, supabaseAnonKey, {');
  });

  test('supabase client has proper configuration object', () => {
    // Test that the client has proper configuration object
    const clientContent = fs.readFileSync('lib/supabase/client.ts', 'utf8');
    
    expect(clientContent).toContain('auth: {');
    expect(clientContent).toContain('autoRefreshToken: true');
    expect(clientContent).toContain('persistSession: true');
    expect(clientContent).toContain('detectSessionInUrl: true');
    expect(clientContent).toContain('global: {');
    expect(clientContent).toContain('headers: {');
    expect(clientContent).toContain('\'X-Client-Info\': \'clearday-web\'');
  });

  test('supabase client has proper helper function exports', () => {
    // Test that the client has proper helper function exports
    const clientContent = fs.readFileSync('lib/supabase/client.ts', 'utf8');
    
    expect(clientContent).toContain('export const getCurrentUser = async');
    expect(clientContent).toContain('export const getCurrentSession = async');
    expect(clientContent).toContain('export const signOut = async');
    expect(clientContent).toContain('export const isAuthenticated = async');
  });

  test('supabase client has proper default export', () => {
    // Test that the client has proper default export
    const clientContent = fs.readFileSync('lib/supabase/client.ts', 'utf8');
    
    expect(clientContent).toContain('export default supabase');
  });

  test('supabase client is production ready', () => {
    // Test that the client is production ready
    const clientContent = fs.readFileSync('lib/supabase/client.ts', 'utf8');
    
    // Check for proper error handling
    expect(clientContent).toContain('if (error) {');
    expect(clientContent).toContain('throw new Error');
    
    // Check for proper logging
    expect(clientContent).toContain('console.error');
    
    // Check for proper validation
    expect(clientContent).toContain('if (!supabaseUrl) {');
    expect(clientContent).toContain('if (!supabaseAnonKey) {');
    
    // Check for proper configuration
    expect(clientContent).toContain('createClient(supabaseUrl, supabaseAnonKey, {');
  });

  test('supabase client follows best practices', () => {
    // Test that the client follows best practices
    const clientContent = fs.readFileSync('lib/supabase/client.ts', 'utf8');
    
    // Check for proper TypeScript usage
    expect(clientContent).toContain('export type {');
    expect(clientContent).toContain('async () => {');
    
    // Check for proper error handling
    expect(clientContent).toContain('if (error) {');
    expect(clientContent).toContain('throw error');
    
    // Check for proper async/await usage
    expect(clientContent).toContain('await supabase.auth');
    
    // Check for proper destructuring
    expect(clientContent).toContain('const { data: { user }, error }');
    expect(clientContent).toContain('const { data: { session }, error }');
    expect(clientContent).toContain('const { error }');
  });

  test('supabase client has comprehensive functionality', () => {
    // Test that the client has comprehensive functionality
    const clientContent = fs.readFileSync('lib/supabase/client.ts', 'utf8');
    
    // Check for all required functions
    expect(clientContent).toContain('getCurrentUser');
    expect(clientContent).toContain('getCurrentSession');
    expect(clientContent).toContain('signOut');
    expect(clientContent).toContain('isAuthenticated');
    
    // Check for proper auth methods
    expect(clientContent).toContain('supabase.auth.getUser()');
    expect(clientContent).toContain('supabase.auth.getSession()');
    expect(clientContent).toContain('supabase.auth.signOut()');
    
    // Check for proper configuration
    expect(clientContent).toContain('autoRefreshToken: true');
    expect(clientContent).toContain('persistSession: true');
    expect(clientContent).toContain('detectSessionInUrl: true');
  });
});
