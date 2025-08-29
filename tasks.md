# ClearDay MVP Development Plan

## Overview
This document provides a granular, test-driven development plan for building the ClearDay MVP. Each task includes integrated Playwright testing to ensure quality throughout development.

## Testing Philosophy
- **Write tests with each feature** - No feature is complete without tests
- **Test immediately** - Run tests after implementation, debug before moving on
- **Maintain test suite** - Keep all tests passing as you progress
- **Debug in-task** - Each task includes time for debugging test failures

---

## Phase 1: Setup Phase (Tasks 1-12)

**Task 1: Initialize Next.js Project**
- **Objective**: Create Next.js 14 project with TypeScript and App Router
- **Files to modify/create**: `package.json`, `next.config.js`, `tsconfig.json`
- **Test Files**: `tests/smoke.spec.ts` (basic app loads)
- **Acceptance Criteria**: 
  - `npm run dev` starts development server on port 3000
  - TypeScript compilation works
  - App router structure exists
  - Basic smoke test passes: `npx playwright test tests/smoke.spec.ts`
- **Dependencies**: None
- **Rollback**: Delete project folder
- **Estimated time**: 20 minutes (15 min setup + 5 min test)

**Task 2: Install Core Dependencies**
- **Objective**: Add shadcn/ui, Tailwind CSS, and core packages
- **Files to modify/create**: `package.json`, `tailwind.config.ts`, `app/globals.css`
- **Test Files**: Update `tests/smoke.spec.ts` (verify styles load)
- **Acceptance Criteria**:
  - All packages install without errors
  - Tailwind utilities work in a test component
  - No version conflicts
  - Test verifies CSS loads: `npx playwright test tests/smoke.spec.ts`
- **Dependencies**: Task 1
- **Rollback**: `git reset --hard` (after git init)
- **Estimated time**: 25 minutes (20 min setup + 5 min test)

**Task 3: Setup Playwright Testing**
- **Objective**: Install and configure Playwright for E2E testing
- **Files to modify/create**: `playwright.config.ts`, `package.json`, `tests/global-setup.ts`
- **Test Files**: `tests/example.spec.ts` (verify Playwright works)
- **Acceptance Criteria**:
  - `npm run test:e2e` runs Playwright tests
  - `npm run test:debug` opens Playwright UI mode
  - Base URL configured for localhost:3000
  - Example test passes
- **Dependencies**: Task 1
- **Rollback**: Remove Playwright files and dependencies
- **Estimated time**: 25 minutes (20 min setup + 5 min verify)

**Task 4: Setup Environment Variables**
- **Objective**: Create environment configuration files
- **Files to modify/create**: `.env.local`, `.env.example`, `.gitignore`, `.env.test`
- **Test Files**: `tests/env.spec.ts` (verify env vars accessible)
- **Acceptance Criteria**:
  - `.env.example` contains all variable names with placeholders
  - `.env.local` is in .gitignore
  - `.env.test` for test environment
  - Environment variables accessible via process.env
  - Test confirms env loading: `npx playwright test tests/env.spec.ts`
- **Dependencies**: Task 1
- **Rollback**: Delete .env files
- **Estimated time**: 20 minutes (15 min setup + 5 min test)

**Task 5: Configure shadcn/ui**
- **Objective**: Initialize shadcn/ui with configuration
- **Files to modify/create**: `components.json`, `lib/utils.ts`, `app/globals.css`
- **Test Files**: `tests/ui/theme.spec.ts` (verify theming works)
- **Acceptance Criteria**:
  - `npx shadcn-ui@latest init` completes successfully
  - CSS variables defined in globals.css
  - cn() utility function works
  - Test verifies theme variables: `npx playwright test tests/ui/theme.spec.ts`
- **Dependencies**: Task 2
- **Rollback**: Remove components.json and revert globals.css
- **Estimated time**: 20 minutes (15 min setup + 5 min test)

**Task 6: Create Base Folder Structure**
- **Objective**: Set up project directory structure per architecture
- **Files to modify/create**: Create folders: `app/(auth)`, `app/(dashboard)`, `components/`, `lib/`, `types/`, `tests/`
- **Test Files**: `tests/structure.spec.ts` (verify routes respond)
- **Acceptance Criteria**:
  - All main directories exist
  - `.gitkeep` files in empty directories
  - Structure matches architecture.md
  - Test verifies folder structure exists
- **Dependencies**: Task 1
- **Rollback**: Remove created folders
- **Estimated time**: 20 minutes (15 min setup + 5 min test)

**Task 7: Add First shadcn Component**
- **Objective**: Install Button component to verify setup
- **Files to modify/create**: `components/ui/button.tsx`
- **Test Files**: `tests/ui/button.spec.ts` (test button component)
- **Acceptance Criteria**:
  - `npx shadcn-ui@latest add button` succeeds
  - Button renders with proper styling
  - Variants (default, destructive, outline) work
  - Test verifies all button variants: `npx playwright test tests/ui/button.spec.ts`
- **Dependencies**: Task 5
- **Rollback**: Delete components/ui/button.tsx
- **Estimated time**: 20 minutes (15 min setup + 5 min test)

**Task 8: Create Base Layout**
- **Objective**: Set up root layout with fonts and metadata
- **Files to modify/create**: `app/layout.tsx`
- **Test Files**: `tests/layout.spec.ts` (verify layout renders)
- **Acceptance Criteria**:
  - Inter font loads correctly
  - Metadata includes title and description
  - Dark mode CSS variables work
  - Test verifies layout elements: `npx playwright test tests/layout.spec.ts`
- **Dependencies**: Task 2
- **Rollback**: Revert to default layout.tsx
- **Estimated time**: 25 minutes (20 min setup + 5 min test)

**Task 9: Create Landing Page**
- **Objective**: Build basic landing page with hero section
- **Files to modify/create**: `app/page.tsx`
- **Test Files**: `tests/pages/landing.spec.ts` (test landing page)
- **Acceptance Criteria**:
  - Hero text displays "Your day, already sorted"
  - Sign up and Login buttons visible
  - Responsive on mobile and desktop
  - Test verifies landing page elements: `npx playwright test tests/pages/landing.spec.ts`
- **Dependencies**: Task 7, Task 8
- **Rollback**: Revert to default page.tsx
- **Estimated time**: 30 minutes (25 min setup + 5 min test)

**Task 10: Setup Git Repository**
- **Objective**: Initialize git and make first commit
- **Files to modify/create**: `.gitignore`
- **Test Files**: None (git operation)
- **Acceptance Criteria**:
  - Git initialized
  - .gitignore excludes node_modules, .env.local
  - First commit includes all files
  - All tests still pass after commit
- **Dependencies**: Task 1-9
- **Rollback**: Remove .git folder
- **Estimated time**: 15 minutes

**Task 11: Add Type Definitions File**
- **Objective**: Create TypeScript type definition structure
- **Files to modify/create**: `types/index.ts`, `types/database.ts`
- **Test Files**: `tests/types.spec.ts` (verify type exports)
- **Acceptance Criteria**:
  - Base types for User, Task, Event defined
  - Types export correctly
  - No TypeScript errors
  - Test imports and uses types successfully
- **Dependencies**: Task 6
- **Rollback**: Delete types files
- **Estimated time**: 25 minutes (20 min setup + 5 min test)

**Task 12: Create Test Utilities**
- **Objective**: Set up test helper functions and fixtures
- **Files to modify/create**: `tests/utils/helpers.ts`, `tests/fixtures/data.ts`
- **Test Files**: `tests/utils/helpers.spec.ts` (test the test utils)
- **Acceptance Criteria**:
  - Test data fixtures created
  - Helper functions for common test operations
  - Page object model base class ready
  - Utility tests pass
- **Dependencies**: Task 3
- **Rollback**: Delete test utility files
- **Estimated time**: 25 minutes (20 min setup + 5 min test)

---

## Phase 2: Database Phase (Tasks 13-27)

**Task 13: Install Supabase CLI**
- **Objective**: Set up Supabase CLI and dependencies
- **Files to modify/create**: `package.json` (add supabase to devDependencies)
- **Test Files**: `tests/supabase/cli.spec.ts` (verify CLI works)
- **Acceptance Criteria**:
  - `npx supabase --version` works
  - Can run `npx supabase init`
  - Config file created
  - Test verifies Supabase CLI available
- **Dependencies**: Task 1
- **Rollback**: Remove supabase from package.json
- **Estimated time**: 20 minutes (15 min setup + 5 min test)

**Task 14: Initialize Supabase Project**
- **Objective**: Create Supabase project structure
- **Files to modify/create**: `supabase/config.toml`, `supabase/` directory structure
- **Test Files**: Update `tests/supabase/cli.spec.ts` (verify project structure)
- **Acceptance Criteria**:
  - `npx supabase init` completes
  - Config file has correct settings
  - Migrations folder exists
  - Test verifies Supabase folders exist
- **Dependencies**: Task 13
- **Rollback**: Delete supabase folder
- **Estimated time**: 20 minutes (15 min setup + 5 min test)

**Task 15: Create Profiles Table Migration**
- **Objective**: Create first database table for user profiles
- **Files to modify/create**: `supabase/migrations/001_create_profiles.sql`
- **Test Files**: `tests/db/profiles.spec.ts` (test table creation)
- **Acceptance Criteria**:
  - Migration file creates profiles table
  - All columns from architecture.md included
  - Migration runs without errors locally
  - Test verifies table structure via Supabase client
- **Dependencies**: Task 14
- **Rollback**: Delete migration file
- **Estimated time**: 25 minutes (20 min setup + 5 min test)

**Task 16: Create Auth Trigger for Profiles**
- **Objective**: Auto-create profile on user signup
- **Files to modify/create**: `supabase/migrations/002_auth_trigger.sql`
- **Test Files**: `tests/db/auth-trigger.spec.ts` (test trigger works)
- **Acceptance Criteria**:
  - Trigger function created
  - New users get profile automatically
  - Email populated from auth.users
  - Test creates user and verifies profile created
- **Dependencies**: Task 15
- **Rollback**: Delete migration file
- **Estimated time**: 30 minutes (25 min setup + 5 min test)

**Task 17: Create Tasks Table**
- **Objective**: Add tasks table to database
- **Files to modify/create**: `supabase/migrations/003_create_tasks.sql`
- **Test Files**: `tests/db/tasks.spec.ts` (test table operations)
- **Acceptance Criteria**:
  - Tasks table created with all columns
  - Foreign key to profiles works
  - Check constraints on priority work
  - Test performs CRUD operations on tasks
- **Dependencies**: Task 15
- **Rollback**: Delete migration file
- **Estimated time**: 25 minutes (20 min setup + 5 min test)

**Task 18: Create Events Table**
- **Objective**: Add events table for calendar items
- **Files to modify/create**: `supabase/migrations/004_create_events.sql`
- **Test Files**: `tests/db/events.spec.ts` (test events table)
- **Acceptance Criteria**:
  - Events table created
  - Timestamps handle timezones correctly
  - Integration_id foreign key optional
  - Test creates and queries events
- **Dependencies**: Task 15
- **Rollback**: Delete migration file
- **Estimated time**: 25 minutes (20 min setup + 5 min test)

**Task 19: Create RLS Policies for Profiles**
- **Objective**: Add Row Level Security to profiles table
- **Files to modify/create**: `supabase/migrations/005_profiles_rls.sql`
- **Test Files**: `tests/db/rls-profiles.spec.ts` (test RLS policies)
- **Acceptance Criteria**:
  - RLS enabled on profiles table
  - Users can only view/edit own profile
  - Policies match architecture.md spec
  - Test verifies user can't access other profiles
- **Dependencies**: Task 15
- **Rollback**: Delete migration file
- **Estimated time**: 25 minutes (20 min setup + 5 min test)

**Task 20: Create RLS Policies for Tasks**
- **Objective**: Add Row Level Security to tasks table
- **Files to modify/create**: `supabase/migrations/006_tasks_rls.sql`
- **Test Files**: `tests/db/rls-tasks.spec.ts` (test task RLS)
- **Acceptance Criteria**:
  - RLS enabled on tasks table
  - Users can CRUD own tasks
  - SELECT/UPDATE/DELETE policies work
  - Test verifies task isolation between users
- **Dependencies**: Task 17
- **Rollback**: Delete migration file
- **Estimated time**: 25 minutes (20 min setup + 5 min test)

**Task 21: Create Indexes for Performance**
- **Objective**: Add database indexes for common queries
- **Files to modify/create**: `supabase/migrations/007_create_indexes.sql`
- **Test Files**: `tests/db/performance.spec.ts` (test query performance)
- **Acceptance Criteria**:
  - Index on tasks(user_id, due_date)
  - Index on events(user_id, start_time)
  - Indexes create successfully
  - Test verifies queries use indexes (EXPLAIN)
- **Dependencies**: Task 17, Task 18
- **Rollback**: Delete migration file
- **Estimated time**: 20 minutes (15 min setup + 5 min test)

**Task 22: Install Supabase Client Libraries**
- **Objective**: Add Supabase JavaScript client
- **Files to modify/create**: `package.json`, `lib/supabase/client.ts`
- **Test Files**: `tests/lib/supabase-client.spec.ts` (test client setup)
- **Acceptance Criteria**:
  - @supabase/supabase-js installed
  - Client initialized with env vars
  - TypeScript types work
  - Test verifies client connects
- **Dependencies**: Task 4
- **Rollback**: Uninstall package, delete client.ts
- **Estimated time**: 25 minutes (20 min setup + 5 min test)

**Task 23: Create Server Supabase Client**
- **Objective**: Set up server-side Supabase client for RSC
- **Files to modify/create**: `lib/supabase/server.ts`
- **Test Files**: `tests/lib/supabase-server.spec.ts` (test server client)
- **Acceptance Criteria**:
  - Server client uses service role key
  - Cookies handled correctly
  - Works in Server Components
  - Test verifies server client auth
- **Dependencies**: Task 22
- **Rollback**: Delete server.ts
- **Estimated time**: 30 minutes (25 min setup + 5 min test)

**Task 24: Generate TypeScript Types**
- **Objective**: Generate database types from Supabase schema
- **Files to modify/create**: `types/database.ts`, `package.json` (add script)
- **Test Files**: `tests/types/database.spec.ts` (test generated types)
- **Acceptance Criteria**:
  - `npm run generate-types` script works
  - Types match database schema
  - No TypeScript errors
  - Test uses generated types successfully
- **Dependencies**: Task 15-18
- **Rollback**: Delete generated types file
- **Estimated time**: 25 minutes (20 min setup + 5 min test)

**Task 25: Test Database Connection**
- **Objective**: Verify Supabase connection works
- **Files to modify/create**: `app/api/test-db/route.ts`
- **Test Files**: `tests/api/test-db.spec.ts` (E2E test of API route)
- **Acceptance Criteria**:
  - Can query profiles table
  - Returns 200 status
  - No connection errors
  - Playwright test hits endpoint successfully
- **Dependencies**: Task 22, Task 23
- **Rollback**: Delete test route
- **Estimated time**: 25 minutes (20 min setup + 5 min test)

**Task 26: Create Seed Data Script**
- **Objective**: Add script to populate test data
- **Files to modify/create**: `supabase/seed.sql`, `tests/fixtures/seed-data.ts`
- **Test Files**: `tests/db/seed.spec.ts` (verify seed data)
- **Acceptance Criteria**:
  - Creates test user
  - Adds sample tasks and events
  - Can run repeatedly without errors
  - Test verifies seed data exists
- **Dependencies**: Task 15-18
- **Rollback**: Delete seed file
- **Estimated time**: 30 minutes (25 min setup + 5 min test)

**Task 27: Setup Local Supabase Instance**
- **Objective**: Start local Supabase for development
- **Files to modify/create**: Update `.env.local` with local URLs, `.env.test`
- **Test Files**: `tests/db/local-connection.spec.ts` (test local instance)
- **Acceptance Criteria**:
  - `npx supabase start` works
  - Studio accessible at localhost:54323
  - Can connect from app
  - Test connects to local instance
- **Dependencies**: Task 14
- **Rollback**: `npx supabase stop`
- **Estimated time**: 25 minutes (20 min setup + 5 min test)

---

## Phase 3: Authentication Phase (Tasks 28-43)

**Task 28: Create Auth Layout**
- **Objective**: Build layout for auth pages
- **Files to modify/create**: `app/(auth)/layout.tsx`
- **Test Files**: `tests/auth/layout.spec.ts` (test auth layout)
- **Acceptance Criteria**:
  - Center-aligned content
  - ClearDay logo/branding visible
  - Responsive design works
  - Test verifies layout renders correctly
- **Dependencies**: Task 6
- **Rollback**: Delete layout file
- **Estimated time**: 25 minutes (20 min setup + 5 min test)

**Task 29: Create Login Page Structure**
- **Objective**: Build login page UI
- **Files to modify/create**: `app/(auth)/login/page.tsx`
- **Test Files**: `tests/auth/login-page.spec.ts` (test login UI)
- **Acceptance Criteria**:
  - Email and password inputs visible
  - Sign in button present
  - Link to signup page works
  - Test verifies all form elements present
- **Dependencies**: Task 28, Task 7
- **Rollback**: Delete page file
- **Estimated time**: 30 minutes (25 min setup + 5 min test)

**Task 30: Create Signup Page Structure**
- **Objective**: Build signup page UI
- **Files to modify/create**: `app/(auth)/signup/page.tsx`
- **Test Files**: `tests/auth/signup-page.spec.ts` (test signup UI)
- **Acceptance Criteria**:
  - Email, password, confirm password fields
  - Create account button present
  - Link to login page works
  - Test verifies form validation
- **Dependencies**: Task 28, Task 7
- **Rollback**: Delete page file
- **Estimated time**: 30 minutes (25 min setup + 5 min test)

**Task 31: Add Form Components**
- **Objective**: Install shadcn form components
- **Files to modify/create**: `components/ui/form.tsx`, `components/ui/input.tsx`, `components/ui/label.tsx`
- **Test Files**: `tests/ui/forms.spec.ts` (test form components)
- **Acceptance Criteria**:
  - Form components installed via shadcn
  - Input styling matches design
  - Form validation ready
  - Test verifies form interactions
- **Dependencies**: Task 5
- **Rollback**: Delete component files
- **Estimated time**: 25 minutes (20 min setup + 5 min test)

**Task 32: Create Login Form Component**
- **Objective**: Build reusable login form with validation
- **Files to modify/create**: `components/auth/LoginForm.tsx`
- **Test Files**: `tests/auth/login-form.spec.ts` (test form behavior)
- **Acceptance Criteria**:
  - Email validation works
  - Password required validation
  - Loading state on submit
  - Test verifies validation and submission
- **Dependencies**: Task 31
- **Rollback**: Delete component file
- **Estimated time**: 35 minutes (30 min setup + 5 min test/debug)

**Task 33: Create Signup Form Component**
- **Objective**: Build signup form with validation
- **Files to modify/create**: `components/auth/SignupForm.tsx`
- **Test Files**: `tests/auth/signup-form.spec.ts` (test signup form)
- **Acceptance Criteria**:
  - Password match validation works
  - Email format validation
  - Error messages display correctly
  - Test verifies all validation rules
- **Dependencies**: Task 31
- **Rollback**: Delete component file
- **Estimated time**: 35 minutes (30 min setup + 5 min test/debug)

**Task 34: Implement Signup Server Action**
- **Objective**: Create server action for user registration
- **Files to modify/create**: `app/actions/auth.ts`
- **Test Files**: `tests/actions/signup.spec.ts` (test signup flow)
- **Acceptance Criteria**:
  - Creates user in Supabase Auth
  - Returns success/error properly
  - Profile created via trigger
  - E2E test creates real user
- **Dependencies**: Task 23, Task 16
- **Rollback**: Delete action file
- **Estimated time**: 30 minutes (25 min setup + 5 min test/debug)

**Task 35: Implement Login Server Action**
- **Objective**: Create server action for authentication
- **Files to modify/create**: `app/actions/auth.ts` (add login function)
- **Test Files**: `tests/actions/login.spec.ts` (test login flow)
- **Acceptance Criteria**:
  - Authenticates with Supabase
  - Sets session cookie
  - Returns user data on success
  - E2E test logs in successfully
- **Dependencies**: Task 34
- **Rollback**: Remove login function
- **Estimated time**: 30 minutes (25 min setup + 5 min test/debug)

**Task 36: Connect Forms to Server Actions**
- **Objective**: Wire up forms to call server actions
- **Files to modify/create**: Update `LoginForm.tsx`, `SignupForm.tsx`
- **Test Files**: `tests/auth/auth-flow.spec.ts` (full auth E2E test)
- **Acceptance Criteria**:
  - Forms submit to server actions
  - Success redirects to /today
  - Errors display to user
  - E2E test completes signup and login
- **Dependencies**: Task 34, Task 35
- **Rollback**: Revert form components
- **Estimated time**: 30 minutes (25 min setup + 5 min test/debug)

**Task 37: Create Auth Context Provider**
- **Objective**: Build context for auth state management
- **Files to modify/create**: `components/auth/AuthProvider.tsx`
- **Test Files**: `tests/auth/auth-provider.spec.ts` (test provider)
- **Acceptance Criteria**:
  - Provides user state to children
  - Handles session refresh
  - TypeScript types correct
  - Test verifies context values
- **Dependencies**: Task 23
- **Rollback**: Delete provider file
- **Estimated time**: 35 minutes (30 min setup + 5 min test/debug)

**Task 38: Add Middleware for Protected Routes**
- **Objective**: Implement route protection middleware
- **Files to modify/create**: `middleware.ts`
- **Test Files**: `tests/auth/middleware.spec.ts` (test protection)
- **Acceptance Criteria**:
  - Redirects to /login if not authenticated
  - Protects /today and /settings routes
  - Allows public routes through
  - Test verifies redirect behavior
- **Dependencies**: Task 23
- **Rollback**: Delete middleware.ts
- **Estimated time**: 30 minutes (25 min setup + 5 min test/debug)

**Task 39: Create Dashboard Layout**
- **Objective**: Build layout for authenticated pages
- **Files to modify/create**: `app/(dashboard)/layout.tsx`
- **Test Files**: `tests/dashboard/layout.spec.ts` (test dashboard layout)
- **Acceptance Criteria**:
  - Navigation sidebar/header present
  - User menu with logout option
  - Protected by auth check
  - Test verifies layout with auth
- **Dependencies**: Task 37, Task 38
- **Rollback**: Delete layout file
- **Estimated time**: 35 minutes (30 min setup + 5 min test/debug)

**Task 40: Implement Logout Functionality**
- **Objective**: Add logout server action and UI
- **Files to modify/create**: `app/actions/auth.ts` (add logout), `components/layouts/UserMenu.tsx`
- **Test Files**: `tests/auth/logout.spec.ts` (test logout flow)
- **Acceptance Criteria**:
  - Logout clears session
  - Redirects to landing page
  - All cookies cleared
  - E2E test verifies logout works
- **Dependencies**: Task 39
- **Rollback**: Remove logout code
- **Estimated time**: 25 minutes (20 min setup + 5 min test/debug)

**Task 41: Add Loading States**
- **Objective**: Create loading UI for auth operations
- **Files to modify/create**: `app/(auth)/loading.tsx`, `components/ui/spinner.tsx`
- **Test Files**: `tests/ui/loading.spec.ts` (test loading states)
- **Acceptance Criteria**:
  - Spinner shows during auth operations
  - Buttons disable while loading
  - No UI jumping
  - Test verifies loading behavior
- **Dependencies**: Task 7
- **Rollback**: Delete loading files
- **Estimated time**: 25 minutes (20 min setup + 5 min test)

**Task 42: Add Auth Error Handling**
- **Objective**: Implement proper error handling for auth
- **Files to modify/create**: Update auth components, add error boundaries
- **Test Files**: `tests/auth/error-handling.spec.ts` (test error cases)
- **Acceptance Criteria**:
  - Invalid credentials show error
  - Network errors handled gracefully
  - User-friendly error messages
  - Test verifies all error scenarios
- **Dependencies**: Task 36
- **Rollback**: Remove error handling code
- **Estimated time**: 30 minutes (25 min setup + 5 min test/debug)

**Task 43: Full Auth Integration Test**
- **Objective**: Comprehensive test of authentication system
- **Files to modify/create**: None (testing only)
- **Test Files**: `tests/auth/integration.spec.ts` (full auth test suite)
- **Acceptance Criteria**:
  - Can create new account
  - Can login with credentials
  - Protected routes redirect properly
  - Logout works correctly
  - All auth tests pass: `npx playwright test tests/auth/`
- **Dependencies**: Task 28-42
- **Rollback**: N/A (testing task)
- **Estimated time**: 30 minutes (all testing and debugging)

---

## Phase 4: Core Features Phase (Tasks 44-75)

**Task 44: Create Today Page Structure**
- **Objective**: Build main Today screen layout
- **Files to modify/create**: `app/(dashboard)/today/page.tsx`
- **Test Files**: `tests/pages/today.spec.ts` (test Today page)
- **Acceptance Criteria**:
  - Page title shows current date
  - Layout sections for summary, tasks, events
  - Responsive grid layout
  - Test verifies page structure with auth
- **Dependencies**: Task 39
- **Rollback**: Delete page file
- **Estimated time**: 30 minutes (25 min setup + 5 min test)

**Task 45: Create Daily Summary Component**
- **Objective**: Build component for AI-generated summary
- **Files to modify/create**: `components/dashboard/DailySummary.tsx`
- **Test Files**: `tests/components/daily-summary.spec.ts`
- **Acceptance Criteria**:
  - Card displays placeholder text
  - "Your day, already sorted" microcopy
  - Loading skeleton ready
  - Test verifies component renders
- **Dependencies**: Task 7
- **Rollback**: Delete component
- **Estimated time**: 25 minutes (20 min setup + 5 min test)

**Task 46: Create Task List Component**
- **Objective**: Build component to display tasks
- **Files to modify/create**: `components/dashboard/TaskList.tsx`
- **Test Files**: `tests/components/task-list.spec.ts`
- **Acceptance Criteria**:
  - Renders list of tasks
  - Checkbox for completion
  - Priority indicators work
  - Test verifies list rendering with mock data
- **Dependencies**: Task 7
- **Rollback**: Delete component
- **Estimated time**: 30 minutes (25 min setup + 5 min test)

**Task 47: Create Task Item Component**
- **Objective**: Build individual task display component
- **Files to modify/create**: `components/dashboard/TaskItem.tsx`
- **Test Files**: `tests/components/task-item.spec.ts`
- **Acceptance Criteria**:
  - Shows title, due time, priority
  - Checkbox toggles completion
  - Edit/delete buttons present
  - Test verifies all interactions
- **Dependencies**: Task 46
- **Rollback**: Delete component
- **Estimated time**: 30 minutes (25 min setup + 5 min test)

**Task 48: Implement Fetch Tasks Server Action**
- **Objective**: Create action to get user's tasks
- **Files to modify/create**: `app/actions/tasks.ts`
- **Test Files**: `tests/actions/fetch-tasks.spec.ts`
- **Acceptance Criteria**:
  - Fetches tasks for current user
  - Filters by date if provided
  - Sorts by priority and time
  - Test verifies data fetching with auth
- **Dependencies**: Task 23
- **Rollback**: Delete action file
- **Estimated time**: 30 minutes (25 min setup + 5 min test/debug)

**Task 49: Connect Task List to Data**
- **Objective**: Wire TaskList to fetch real tasks
- **Files to modify/create**: Update `TaskList.tsx`, `today/page.tsx`
- **Test Files**: `tests/integration/task-list-data.spec.ts`
- **Acceptance Criteria**:
  - Tasks load from database
  - Shows only today's tasks
  - Loading state works
  - E2E test verifies real data loads
- **Dependencies**: Task 48
- **Rollback**: Revert components
- **Estimated time**: 30 minutes (25 min setup + 5 min test/debug)

**Task 50: Create Add Task Dialog**
- **Objective**: Build modal for creating new tasks
- **Files to modify/create**: `components/dashboard/AddTaskDialog.tsx`
- **Test Files**: `tests/components/add-task-dialog.spec.ts`
- **Acceptance Criteria**:
  - Dialog opens on button click
  - Form with title, date, priority
  - Cancel and Save buttons work
  - Test verifies dialog interaction
- **Dependencies**: Task 7, Task 31
- **Rollback**: Delete component
- **Estimated time**: 35 minutes (30 min setup + 5 min test)

**Task 51: Implement Create Task Server Action**
- **Objective**: Add server action to create tasks
- **Files to modify/create**: `app/actions/tasks.ts` (add createTask)
- **Test Files**: `tests/actions/create-task.spec.ts`
- **Acceptance Criteria**:
  - Creates task in database
  - Associates with current user
  - Returns new task data
  - Test creates real task with auth
- **Dependencies**: Task 48
- **Rollback**: Remove function
- **Estimated time**: 25 minutes (20 min setup + 5 min test/debug)

**Task 52: Connect Add Task to Server**
- **Objective**: Wire up task creation flow
- **Files to modify/create**: Update `AddTaskDialog.tsx`
- **Test Files**: `tests/integration/create-task-flow.spec.ts`
- **Acceptance Criteria**:
  - Form submits to server action
  - New task appears in list
  - Dialog closes on success
  - E2E test creates task and verifies display
- **Dependencies**: Task 51
- **Rollback**: Revert component
- **Estimated time**: 30 minutes (25 min setup + 5 min test/debug)

**Task 53: Implement Complete Task Action**
- **Objective**: Add task completion functionality
- **Files to modify/create**: `app/actions/tasks.ts` (add completeTask)
- **Test Files**: `tests/actions/complete-task.spec.ts`
- **Acceptance Criteria**:
  - Toggles task completion status
  - Updates completed_at timestamp
  - Returns updated task
  - Test verifies completion toggle
- **Dependencies**: Task 48
- **Rollback**: Remove function
- **Estimated time**: 25 minutes (20 min setup + 5 min test/debug)

**Task 54: Wire Up Task Completion**
- **Objective**: Connect checkbox to completion action
- **Files to modify/create**: Update `TaskItem.tsx`
- **Test Files**: `tests/integration/task-completion.spec.ts`
- **Acceptance Criteria**:
  - Checkbox toggles task status
  - Optimistic update works
  - Strikethrough on completed
  - E2E test completes task
- **Dependencies**: Task 53
- **Rollback**: Revert component
- **Estimated time**: 30 minutes (25 min setup + 5 min test/debug)

**Task 55: Create Calendar View Component**
- **Objective**: Build basic calendar display
- **Files to modify/create**: `components/dashboard/CalendarView.tsx`
- **Test Files**: `tests/components/calendar-view.spec.ts`
- **Acceptance Criteria**:
  - Shows today's events
  - Time slots visible
  - Event cards display
  - Test verifies calendar structure
- **Dependencies**: Task 7
- **Rollback**: Delete component
- **Estimated time**: 35 minutes (30 min setup + 5 min test)

**Task 56: Create Event Card Component**
- **Objective**: Build component for event display
- **Files to modify/create**: `components/dashboard/EventCard.tsx`
- **Test Files**: `tests/components/event-card.spec.ts`
- **Acceptance Criteria**:
  - Shows event title and time
  - Location if available
  - Duration indicator
  - Test verifies event display
- **Dependencies**: Task 7
- **Rollback**: Delete component
- **Estimated time**: 25 minutes (20 min setup + 5 min test)

**Task 57: Implement Fetch Events Action**
- **Objective**: Create action to get user's events
- **Files to modify/create**: `app/actions/events.ts`
- **Test Files**: `tests/actions/fetch-events.spec.ts`
- **Acceptance Criteria**:
  - Fetches events for date range
  - Sorts by start time
  - Includes all event fields
  - Test verifies event fetching
- **Dependencies**: Task 23
- **Rollback**: Delete action file
- **Estimated time**: 30 minutes (25 min setup + 5 min test/debug)

**Task 58: Connect Calendar to Events**
- **Objective**: Wire CalendarView to real data
- **Files to modify/create**: Update `CalendarView.tsx`, `today/page.tsx`
- **Test Files**: `tests/integration/calendar-data.spec.ts`
- **Acceptance Criteria**:
  - Events load from database
  - Today's events displayed
  - Time conflicts highlighted
  - E2E test verifies calendar with data
- **Dependencies**: Task 57
- **Rollback**: Revert components
- **Estimated time**: 30 minutes (25 min setup + 5 min test/debug)

**Task 59: Create Settings Page Structure**
- **Objective**: Build settings page layout
- **Files to modify/create**: `app/(dashboard)/settings/page.tsx`
- **Test Files**: `tests/pages/settings.spec.ts`
- **Acceptance Criteria**:
  - Tabs for different settings sections
  - Profile section visible
  - Privacy section visible
  - Test verifies settings page access
- **Dependencies**: Task 39
- **Rollback**: Delete page file
- **Estimated time**: 30 minutes (25 min setup + 5 min test)

**Task 60: Create Privacy Toggle Component**
- **Objective**: Build privacy mode toggle switch
- **Files to modify/create**: `components/privacy/PrivacyToggle.tsx`
- **Test Files**: `tests/components/privacy-toggle.spec.ts`
- **Acceptance Criteria**:
  - Toggle switch for Local Mode
  - Explanation text displays
  - State persists to profile
  - Test verifies toggle interaction
- **Dependencies**: Task 7
- **Rollback**: Delete component
- **Estimated time**: 30 minutes (25 min setup + 5 min test)

**Task 61: Implement Update Profile Action**
- **Objective**: Create action to update user profile
- **Files to modify/create**: `app/actions/profile.ts`
- **Test Files**: `tests/actions/update-profile.spec.ts`
- **Acceptance Criteria**:
  - Updates profile fields
  - Handles privacy settings
  - Returns updated profile
  - Test verifies profile update
- **Dependencies**: Task 23
- **Rollback**: Delete action file
- **Estimated time**: 25 minutes (20 min setup + 5 min test/debug)

**Task 62: Connect Privacy Settings**
- **Objective**: Wire privacy toggle to backend
- **Files to modify/create**: Update `PrivacyToggle.tsx`, settings page
- **Test Files**: `tests/integration/privacy-settings.spec.ts`
- **Acceptance Criteria**:
  - Toggle updates database
  - Setting persists on refresh
  - Toast confirms change
  - E2E test toggles privacy mode
- **Dependencies**: Task 61
- **Rollback**: Revert components
- **Estimated time**: 30 minutes (25 min setup + 5 min test/debug)

**Task 63: Create Progress Component**
- **Objective**: Build progress display card
- **Files to modify/create**: `components/dashboard/ProgressCard.tsx`
- **Test Files**: `tests/components/progress-card.spec.ts`
- **Acceptance Criteria**:
  - Shows tasks completed today
  - Shows streak counter
  - Placeholder for CO₂ saved
  - Test verifies progress display
- **Dependencies**: Task 7
- **Rollback**: Delete component
- **Estimated time**: 30 minutes (25 min setup + 5 min test)

**Task 64: Create Nudge Card Component**
- **Objective**: Build component for behavioral nudges
- **Files to modify/create**: `components/nudges/NudgeCard.tsx`
- **Test Files**: `tests/components/nudge-card.spec.ts`
- **Acceptance Criteria**:
  - Card displays nudge message
  - Action button present
  - Dismiss option available
  - Test verifies nudge interactions
- **Dependencies**: Task 7
- **Rollback**: Delete component
- **Estimated time**: 30 minutes (25 min setup + 5 min test)

**Task 65: Add Toast Notifications**
- **Objective**: Install and configure toast component
- **Files to modify/create**: `components/ui/toast.tsx`, `components/ui/toaster.tsx`
- **Test Files**: `tests/ui/toast.spec.ts`
- **Acceptance Criteria**:
  - Toast component installed
  - Success/error variants work
  - Auto-dismiss after 3 seconds
  - Test verifies toast behavior
- **Dependencies**: Task 5
- **Rollback**: Delete toast files
- **Estimated time**: 25 minutes (20 min setup + 5 min test)

**Task 66: Add Toast Provider**
- **Objective**: Set up global toast notifications
- **Files to modify/create**: Update root layout with Toaster
- **Test Files**: `tests/integration/toast-notifications.spec.ts`
- **Acceptance Criteria**:
  - Toasts appear on actions
  - Success messages for task creation
  - Error messages on failures
  - E2E test verifies toasts appear
- **Dependencies**: Task 65
- **Rollback**: Remove Toaster from layout
- **Estimated time**: 25 minutes (20 min setup + 5 min test)

**Task 67: Create Edit Task Dialog**
- **Objective**: Build modal for editing tasks
- **Files to modify/create**: `components/dashboard/EditTaskDialog.tsx`
- **Test Files**: `tests/components/edit-task-dialog.spec.ts`
- **Acceptance Criteria**:
  - Pre-fills with task data
  - Save updates task
  - Delete option available
  - Test verifies edit dialog
- **Dependencies**: Task 50
- **Rollback**: Delete component
- **Estimated time**: 35 minutes (30 min setup + 5 min test)

**Task 68: Implement Update Task Action**
- **Objective**: Add server action to edit tasks
- **Files to modify/create**: `app/actions/tasks.ts` (add updateTask)
- **Test Files**: `tests/actions/update-task.spec.ts`
- **Acceptance Criteria**:
  - Updates task in database
  - Validates user ownership
  - Returns updated task
  - Test verifies task update
- **Dependencies**: Task 48
- **Rollback**: Remove function
- **Estimated time**: 25 minutes (20 min setup + 5 min test/debug)

**Task 69: Implement Delete Task Action**
- **Objective**: Add server action to delete tasks
- **Files to modify/create**: `app/actions/tasks.ts` (add deleteTask)
- **Test Files**: `tests/actions/delete-task.spec.ts`
- **Acceptance Criteria**:
  - Soft deletes task
  - Validates user ownership
  - Returns success status
  - Test verifies task deletion
- **Dependencies**: Task 48
- **Rollback**: Remove function
- **Estimated time**: 25 minutes (20 min setup + 5 min test/debug)

**Task 70: Connect Edit/Delete Functions**
- **Objective**: Wire up task editing and deletion
- **Files to modify/create**: Update `EditTaskDialog.tsx`, `TaskItem.tsx`
- **Test Files**: `tests/integration/task-edit-delete.spec.ts`
- **Acceptance Criteria**:
  - Edit button opens dialog
  - Save updates task in list
  - Delete removes from list
  - E2E test edits and deletes task
- **Dependencies**: Task 68, Task 69
- **Rollback**: Revert components
- **Estimated time**: 30 minutes (25 min setup + 5 min test/debug)

**Task 71: Add Keyboard Shortcuts**
- **Objective**: Implement hotkeys for common actions
- **Files to modify/create**: `lib/hooks/useKeyboardShortcuts.ts`
- **Test Files**: `tests/features/keyboard-shortcuts.spec.ts`
- **Acceptance Criteria**:
  - Cmd/Ctrl+N opens new task
  - Escape closes dialogs
  - / focuses search (placeholder)
  - Test verifies keyboard shortcuts
- **Dependencies**: Task 50
- **Rollback**: Delete hook file
- **Estimated time**: 30 minutes (25 min setup + 5 min test)

**Task 72: Create Mobile Navigation**
- **Objective**: Build responsive nav for mobile
- **Files to modify/create**: `components/layouts/MobileNav.tsx`
- **Test Files**: `tests/mobile/navigation.spec.ts`
- **Acceptance Criteria**:
  - Hamburger menu on mobile
  - Drawer slides from left
  - All nav items accessible
  - Test verifies mobile nav at 375px width
- **Dependencies**: Task 39
- **Rollback**: Delete component
- **Estimated time**: 35 minutes (30 min setup + 5 min test)

**Task 73: Add Loading Skeletons**
- **Objective**: Create skeleton loaders for better UX
- **Files to modify/create**: `components/ui/skeleton.tsx`, update components
- **Test Files**: `tests/ui/skeletons.spec.ts`
- **Acceptance Criteria**:
  - Task list shows skeletons
  - Calendar shows placeholders
  - No layout shift on load
  - Test verifies skeleton display
- **Dependencies**: Task 5
- **Rollback**: Remove skeleton usage
- **Estimated time**: 30 minutes (25 min setup + 5 min test)

**Task 74: Add Pagination to Task List**
- **Objective**: Implement task list pagination
- **Files to modify/create**: Update `TaskList.tsx`, add pagination component
- **Test Files**: `tests/features/pagination.spec.ts`
- **Acceptance Criteria**:
  - Shows 10 tasks per page
  - Next/Previous buttons work
  - Page indicator accurate
  - Test verifies pagination
- **Dependencies**: Task 49
- **Rollback**: Remove pagination code
- **Estimated time**: 30 minutes (25 min setup + 5 min test)

**Task 75: Full Feature Integration Test**
- **Objective**: Test all core features together
- **Files to modify/create**: None (testing only)
- **Test Files**: `tests/integration/full-flow.spec.ts`
- **Acceptance Criteria**:
  - User can sign up
  - Create multiple tasks
  - Complete and edit tasks
  - View calendar
  - Change settings
  - Full E2E test passes
- **Dependencies**: Task 44-74
- **Rollback**: N/A (testing task)
- **Estimated time**: 35 minutes (all testing and debugging)

---

## Phase 5: Polish Phase (Tasks 76-90)

**Task 76: Add Error Boundaries**
- **Objective**: Implement React error boundaries
- **Files to modify/create**: `app/error.tsx`, `components/ErrorBoundary.tsx`
- **Test Files**: `tests/error/boundaries.spec.ts`
- **Acceptance Criteria**:
  - Catches component errors
  - Shows user-friendly message
  - Log errors (console for now)
  - Test verifies error catching
- **Dependencies**: Task 1
- **Rollback**: Delete error files
- **Estimated time**: 30 minutes (25 min setup + 5 min test)

**Task 77: Add 404 Page**
- **Objective**: Create not found page
- **Files to modify/create**: `app/not-found.tsx`
- **Test Files**: `tests/pages/not-found.spec.ts`
- **Acceptance Criteria**:
  - Custom 404 message
  - Link back to home
  - Consistent with design
  - Test verifies 404 page
- **Dependencies**: Task 7
- **Rollback**: Delete not-found.tsx
- **Estimated time**: 20 minutes (15 min setup + 5 min test)

**Task 78: Implement Input Validation**
- **Objective**: Add Zod schemas for validation
- **Files to modify/create**: `lib/validations/index.ts`
- **Test Files**: `tests/validation/schemas.spec.ts`
- **Acceptance Criteria**:
  - Task validation schema works
  - Email validation correct
  - Error messages helpful
  - Test verifies all schemas
- **Dependencies**: Task 2 (zod installed)
- **Rollback**: Delete validation file
- **Estimated time**: 30 minutes (25 min setup + 5 min test)

**Task 79: Add Form Error Handling**
- **Objective**: Display validation errors in forms
- **Files to modify/create**: Update form components
- **Test Files**: `tests/forms/error-display.spec.ts`
- **Acceptance Criteria**:
  - Field-level errors display
  - Form-level errors show
  - Errors clear on correction
  - Test verifies error display
- **Dependencies**: Task 78
- **Rollback**: Revert form components
- **Estimated time**: 35 minutes (30 min setup + 5 min test/debug)

**Task 80: Add Empty States**
- **Objective**: Create UI for empty data states
- **Files to modify/create**: `components/EmptyState.tsx`, update lists
- **Test Files**: `tests/ui/empty-states.spec.ts`
- **Acceptance Criteria**:
  - "No tasks" message shows
  - "No events" message shows
  - Call-to-action buttons work
  - Test verifies empty states
- **Dependencies**: Task 7
- **Rollback**: Delete component
- **Estimated time**: 30 minutes (25 min setup + 5 min test)

**Task 81: Add Confirmation Dialogs**
- **Objective**: Add delete confirmation modals
- **Files to modify/create**: `components/ui/alert-dialog.tsx`
- **Test Files**: `tests/ui/confirmations.spec.ts`
- **Acceptance Criteria**:
  - Confirms before delete
  - Clear warning message
  - Cancel aborts action
  - Test verifies confirmation flow
- **Dependencies**: Task 5
- **Rollback**: Remove confirmations
- **Estimated time**: 30 minutes (25 min setup + 5 min test)

**Task 82: Optimize Bundle Size**
- **Objective**: Configure Next.js optimization
- **Files to modify/create**: `next.config.js`
- **Test Files**: `tests/performance/bundle.spec.ts`
- **Acceptance Criteria**:
  - Bundle analyzer works
  - Tree shaking enabled
  - Images optimized
  - Test verifies bundle size < 500KB
- **Dependencies**: Task 1
- **Rollback**: Revert config
- **Estimated time**: 25 minutes (20 min setup + 5 min test)

**Task 83: Add Meta Tags**
- **Objective**: Implement SEO meta tags
- **Files to modify/create**: Update layout.tsx, add metadata
- **Test Files**: `tests/seo/meta-tags.spec.ts`
- **Acceptance Criteria**:
  - Open Graph tags present
  - Twitter Card tags work
  - Description accurate
  - Test verifies meta tags
- **Dependencies**: Task 8
- **Rollback**: Remove meta tags
- **Estimated time**: 25 minutes (20 min setup + 5 min test)

**Task 84: Add PWA Manifest**
- **Objective**: Create web app manifest
- **Files to modify/create**: `public/manifest.json`, icons
- **Test Files**: `tests/pwa/manifest.spec.ts`
- **Acceptance Criteria**:
  - Manifest validates
  - Icons in multiple sizes
  - Theme color set
  - Test verifies manifest loads
- **Dependencies**: Task 1
- **Rollback**: Delete manifest
- **Estimated time**: 30 minutes (25 min setup + 5 min test)

**Task 85: Implement Dark Mode**
- **Objective**: Add dark mode toggle
- **Files to modify/create**: `components/ThemeToggle.tsx`, update CSS
- **Test Files**: `tests/features/dark-mode.spec.ts`
- **Acceptance Criteria**:
  - Toggle switches themes
  - Preference persists
  - All components themed
  - Test verifies theme switching
- **Dependencies**: Task 7
- **Rollback**: Remove theme code
- **Estimated time**: 35 minutes (30 min setup + 5 min test)

**Task 86: Add Analytics Events**
- **Objective**: Track basic usage events
- **Files to modify/create**: `lib/analytics.ts`
- **Test Files**: `tests/analytics/tracking.spec.ts`
- **Acceptance Criteria**:
  - Page view tracking works
  - Task completion tracked
  - Privacy mode respected
  - Test verifies event firing
- **Dependencies**: Task 60
- **Rollback**: Delete analytics file
- **Estimated time**: 30 minutes (25 min setup + 5 min test)

**Task 87: Add Rate Limiting**
- **Objective**: Implement basic rate limiting
- **Files to modify/create**: Update server actions
- **Test Files**: `tests/security/rate-limiting.spec.ts`
- **Acceptance Criteria**:
  - Limits API calls per minute
  - Returns 429 on excess
  - User-friendly error message
  - Test verifies rate limiting
- **Dependencies**: Task 34
- **Rollback**: Remove rate limiting
- **Estimated time**: 30 minutes (25 min setup + 5 min test)

**Task 88: Add Data Export**
- **Objective**: Let users export their data
- **Files to modify/create**: `app/actions/export.ts`, settings page
- **Test Files**: `tests/features/data-export.spec.ts`
- **Acceptance Criteria**:
  - Exports tasks to JSON
  - Download triggers properly
  - Privacy mode noted
  - Test verifies export download
- **Dependencies**: Task 59
- **Rollback**: Remove export feature
- **Estimated time**: 35 minutes (30 min setup + 5 min test)

**Task 89: Performance Testing**
- **Objective**: Add Web Vitals and performance tests
- **Files to modify/create**: `app/layout.tsx`, `lib/vitals.ts`
- **Test Files**: `tests/performance/vitals.spec.ts`
- **Acceptance Criteria**:
  - LCP < 2.5s
  - FID < 100ms
  - CLS < 0.1
  - Test verifies performance metrics
- **Dependencies**: Task 8
- **Rollback**: Remove vitals code
- **Estimated time**: 30 minutes (25 min setup + 5 min test)

**Task 90: Final MVP Testing Suite**
- **Objective**: Complete regression testing
- **Files to modify/create**: Update any issues found
- **Test Files**: `tests/regression/mvp-suite.spec.ts`
- **Acceptance Criteria**:
  - All features work together
  - No console errors
  - Mobile experience smooth (test at 375px, 768px, 1920px)
  - Forms validate properly
  - Full test suite passes: `npx playwright test`
  - Generate test report: `npx playwright show-report`
- **Dependencies**: All previous tasks
- **Rollback**: Fix specific issues found
- **Estimated time**: 40 minutes (all testing, debugging, and fixes)

---

## Testing Commands Reference

```bash
# Run all tests
npx playwright test

# Run specific test file
npx playwright test tests/auth/login.spec.ts

# Run tests in UI mode (debugging)
npx playwright test --ui

# Run tests with specific tag
npx playwright test --grep @auth

# Run tests in headed mode (see browser)
npx playwright test --headed

# Generate test report
npx playwright show-report

# Update snapshots
npx playwright test --update-snapshots
```

## Playwright Configuration

```typescript
// playwright.config.ts
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

## Test Organization

```
tests/
├── auth/           # Authentication tests
├── pages/          # Page-level tests  
├── components/     # Component tests
├── actions/        # Server action tests
├── integration/    # Full flow tests
├── mobile/         # Mobile-specific tests
├── performance/    # Performance tests
├── regression/     # Regression suite
├── utils/          # Test utilities
└── fixtures/       # Test data
```

## Debugging Strategy

1. **When a test fails:**
   - Run in UI mode: `npx playwright test --ui`
   - Check screenshots in `test-results/`
   - Review trace files for step-by-step execution
   - Add `await page.pause()` for debugging

2. **Common debugging commands:**
   ```typescript
   // Pause execution
   await page.pause();
   
   // Take screenshot
   await page.screenshot({ path: 'debug.png' });
   
   // Log page content
   console.log(await page.content());
   
   // Wait for specific element
   await page.waitForSelector('.my-element');
   ```

3. **Fix test, don't skip:**
   - Never use `.skip()` without fixing
   - Debug immediately when test fails
   - Keep test suite green at all times

## Completion Checklist

### Must Have for MVP Launch
- [ ] All 90 tasks completed
- [ ] Full test suite passes (100% green)
- [ ] No console errors in production build
- [ ] Mobile responsive (tested at 375px, 768px, 1920px)
- [ ] Authentication flow works end-to-end
- [ ] Task CRUD operations work
- [ ] Privacy toggle persists
- [ ] Error handling present
- [ ] Loading states implemented
- [ ] Performance metrics pass (LCP < 2.5s)

### Testing Metrics
- [ ] Test coverage > 80%
- [ ] All E2E tests passing
- [ ] No flaky tests
- [ ] Test execution time < 5 minutes
- [ ] Zero accessibility violations

---

## Notes for Development

1. **Test-First Approach**: Write/update tests before implementing features
2. **Debug Immediately**: Don't move to next task if tests are failing
3. **Maintain Green Suite**: All tests must pass before committing
4. **Use UI Mode**: Playwright UI mode is your friend for debugging
5. **Test Multiple Viewports**: Always test mobile and desktop
6. **Screenshot on Failure**: Helps debug CI failures
7. **Keep Tests Fast**: Mock external services when possible
8. **Document Flaky Tests**: If a test is flaky, fix it or document why

## Emergency Rollback Procedure

If a task breaks the test suite:
1. Run failing test in UI mode: `npx playwright test --ui`
2. Check the specific rollback steps for that task
3. If git initialized: `git reset --hard HEAD~1`
4. Re-run full test suite: `npx playwright test`
5. If still broken, check test-results/ folder for clues
6. Clear all test data and retry
7. As last resort, skip the test temporarily and create fix task

---

## Time Estimate

Total development time: **38-45 hours** of focused work
- Setup Phase: 4.5 hours
- Database Phase: 5.5 hours  
- Authentication Phase: 6.5 hours
- Core Features Phase: 13.5 hours
- Polish Phase: 8 hours
- Additional 20-25% for debugging based on test results

This plan ensures quality is built-in from the start, with testing integrated into every single task.