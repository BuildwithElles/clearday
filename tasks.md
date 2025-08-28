# ClearDay MVP Development Plan

## Overview
This document provides a granular, task-by-task development plan for building the ClearDay MVP. Each task is designed to be completed in 15-30 minutes with clear deliverables and testing criteria.

---

## Phase 1: Setup Phase (Tasks 1-10)

**Task 1: Initialize Next.js Project**
- **Objective**: Create Next.js 14 project with TypeScript and App Router
- **Files to modify/create**: `package.json`, `next.config.js`, `tsconfig.json`
- **Acceptance Criteria**: 
  - `npm run dev` starts development server on port 3000
  - TypeScript compilation works
  - App router structure exists
- **Dependencies**: None
- **Rollback**: Delete project folder
- **Estimated time**: 15 minutes

**Task 2: Install Core Dependencies**
- **Objective**: Add shadcn/ui, Tailwind CSS, and core packages
- **Files to modify/create**: `package.json`, `tailwind.config.ts`, `app/globals.css`
- **Acceptance Criteria**:
  - All packages install without errors
  - Tailwind utilities work in a test component
  - No version conflicts
- **Dependencies**: Task 1
- **Rollback**: `git reset --hard` (after git init)
- **Estimated time**: 20 minutes

**Task 3: Setup Environment Variables**
- **Objective**: Create environment configuration files
- **Files to modify/create**: `.env.local`, `.env.example`, `.gitignore`
- **Acceptance Criteria**:
  - `.env.example` contains all variable names with placeholders
  - `.env.local` is in .gitignore
  - Environment variables accessible via process.env
- **Dependencies**: Task 1
- **Rollback**: Delete .env files
- **Estimated time**: 15 minutes

**Task 4: Configure shadcn/ui**
- **Objective**: Initialize shadcn/ui with configuration
- **Files to modify/create**: `components.json`, `lib/utils.ts`, `app/globals.css`
- **Acceptance Criteria**:
  - `npx shadcn-ui@latest init` completes successfully
  - CSS variables defined in globals.css
  - cn() utility function works
- **Dependencies**: Task 2
- **Rollback**: Remove components.json and revert globals.css
- **Estimated time**: 15 minutes

**Task 5: Create Base Folder Structure**
- **Objective**: Set up project directory structure per architecture
- **Files to modify/create**: Create folders: `app/(auth)`, `app/(dashboard)`, `components/`, `lib/`, `types/`
- **Acceptance Criteria**:
  - All main directories exist
  - `.gitkeep` files in empty directories
  - Structure matches architecture.md
- **Dependencies**: Task 1
- **Rollback**: Remove created folders
- **Estimated time**: 15 minutes

**Task 6: Add First shadcn Component**
- **Objective**: Install Button component to verify setup
- **Files to modify/create**: `components/ui/button.tsx`
- **Acceptance Criteria**:
  - `npx shadcn-ui@latest add button` succeeds
  - Button renders with proper styling
  - Variants (default, destructive, outline) work
- **Dependencies**: Task 4
- **Rollback**: Delete components/ui/button.tsx
- **Estimated time**: 15 minutes

**Task 7: Create Base Layout**
- **Objective**: Set up root layout with fonts and metadata
- **Files to modify/create**: `app/layout.tsx`
- **Acceptance Criteria**:
  - Inter font loads correctly
  - Metadata includes title and description
  - Dark mode CSS variables work
- **Dependencies**: Task 2
- **Rollback**: Revert to default layout.tsx
- **Estimated time**: 20 minutes

**Task 8: Create Landing Page**
- **Objective**: Build basic landing page with hero section
- **Files to modify/create**: `app/page.tsx`
- **Acceptance Criteria**:
  - Hero text displays "Your day, already sorted"
  - Sign up and Login buttons visible
  - Responsive on mobile and desktop
- **Dependencies**: Task 6, Task 7
- **Rollback**: Revert to default page.tsx
- **Estimated time**: 25 minutes

**Task 9: Setup Git Repository**
- **Objective**: Initialize git and make first commit
- **Files to modify/create**: `.gitignore`
- **Acceptance Criteria**:
  - Git initialized
  - .gitignore excludes node_modules, .env.local
  - First commit includes all files
- **Dependencies**: Task 1-8
- **Rollback**: Remove .git folder
- **Estimated time**: 15 minutes

**Task 10: Add Type Definitions File**
- **Objective**: Create TypeScript type definition structure
- **Files to modify/create**: `types/index.ts`, `types/database.ts`
- **Acceptance Criteria**:
  - Base types for User, Task, Event defined
  - Types export correctly
  - No TypeScript errors
- **Dependencies**: Task 5
- **Rollback**: Delete types files
- **Estimated time**: 20 minutes

---

## Phase 2: Database Phase (Tasks 11-25)

**Task 11: Install Supabase CLI**
- **Objective**: Set up Supabase CLI and dependencies
- **Files to modify/create**: `package.json` (add supabase to devDependencies)
- **Acceptance Criteria**:
  - `npx supabase --version` works
  - Can run `npx supabase init`
  - Config file created
- **Dependencies**: Task 1
- **Rollback**: Remove supabase from package.json
- **Estimated time**: 15 minutes

**Task 12: Initialize Supabase Project**
- **Objective**: Create Supabase project structure
- **Files to modify/create**: `supabase/config.toml`, `supabase/` directory structure
- **Acceptance Criteria**:
  - `npx supabase init` completes
  - Config file has correct settings
  - Migrations folder exists
- **Dependencies**: Task 11
- **Rollback**: Delete supabase folder
- **Estimated time**: 15 minutes

**Task 13: Create Profiles Table Migration**
- **Objective**: Create first database table for user profiles
- **Files to modify/create**: `supabase/migrations/001_create_profiles.sql`
- **Acceptance Criteria**:
  - Migration file creates profiles table
  - All columns from architecture.md included
  - Migration runs without errors locally
- **Dependencies**: Task 12
- **Rollback**: Delete migration file
- **Estimated time**: 20 minutes

**Task 14: Create Auth Trigger for Profiles**
- **Objective**: Auto-create profile on user signup
- **Files to modify/create**: `supabase/migrations/002_auth_trigger.sql`
- **Acceptance Criteria**:
  - Trigger function created
  - New users get profile automatically
  - Email populated from auth.users
- **Dependencies**: Task 13
- **Rollback**: Delete migration file
- **Estimated time**: 25 minutes

**Task 15: Create Tasks Table**
- **Objective**: Add tasks table to database
- **Files to modify/create**: `supabase/migrations/003_create_tasks.sql`
- **Acceptance Criteria**:
  - Tasks table created with all columns
  - Foreign key to profiles works
  - Check constraints on priority work
- **Dependencies**: Task 13
- **Rollback**: Delete migration file
- **Estimated time**: 20 minutes

**Task 16: Create Events Table**
- **Objective**: Add events table for calendar items
-ながFiles to modify/create**: `supabase/migrations/004_create_events.sql`
- **Acceptance Criteria**:
  - Events table created
  - Timestamps handle timezones correctly
  - Integration_id foreign key optional
- **Dependencies**: Task 13
- **Rollback**: Delete migration file
- **Estimated time**: 20 minutes

**Task 17: Create RLS Policies for Profiles**
- **Objective**: Add Row Level Security to profiles table
- **Files to modify/create**: `supabase/migrations/005_profiles_rls.sql`
- **Acceptance Criteria**:
  - RLS enabled on profiles table
  - Users can only view/edit own profile
  - Policies match architecture.md spec
- **Dependencies**: Task 13
- **Rollback**: Delete migration file
- **Estimated time**: 20 minutes

**Task 18: Create RLS Policies for Tasks**
- **Objective**: Add Row Level Security to tasks table
- **Files to modify/create**: `supabase/migrations/006_tasks_rls.sql`
- **Acceptance Criteria**:
  - RLS enabled on tasks table
  - Users can CRUD own tasks
  - SELECT/UPDATE/DELETE policies work
- **Dependencies**: Task 15
- **Rollback**: Delete migration file
- **Estimated time**: 20 minutes

**Task 19: Create Indexes for Performance**
- **Objective**: Add database indexes for common queries
- **Files to modify/create**: `supabase/migrations/007_create_indexes.sql`
- **Acceptance Criteria**:
  - Index on tasks(user_id, due_date)
  - Index on events(user_id, start_time)
  - Indexes create successfully
- **Dependencies**: Task 15, Task 16
- **Rollback**: Delete migration file
- **Estimated time**: 15 minutes

**Task 20: Install Supabase Client Libraries**
- **Objective**: Add Supabase JavaScript client
- **Files to modify/create**: `package.json`, `lib/supabase/client.ts`
- **Acceptance Criteria**:
  - @supabase/supabase-js installed
  - Client initialized with env vars
  - TypeScript types work
- **Dependencies**: Task 3
- **Rollback**: Uninstall package, delete client.ts
- **Estimated time**: 20 minutes

**Task 21: Create Server Supabase Client**
- **Objective**: Set up server-side Supabase client for RSC
- **Files to modify/create**: `lib/supabase/server.ts`
- **Acceptance Criteria**:
  - Server client uses service role key
  - Cookies handled correctly
  - Works in Server Components
- **Dependencies**: Task 20
- **Rollback**: Delete server.ts
- **Estimated time**: 25 minutes

**Task 22: Generate TypeScript Types**
- **Objective**: Generate database types from Supabase schema
- **Files to modify/create**: `types/database.ts`, `package.json` (add script)
- **Acceptance Criteria**:
  - `npm run generate-types` script works
  - Types match database schema
  - No TypeScript errors
- **Dependencies**: Task 13-16
- **Rollback**: Delete generated types file
- **Estimated time**: 20 minutes

**Task 23: Test Database Connection**
- **Objective**: Verify Supabase connection works
- **Files to modify/create**: `app/api/test-db/route.ts`
- **Acceptance Criteria**:
  - Can query profiles table
  - Returns 200 status
  - No connection errors
- **Dependencies**: Task 20, Task 21
- **Rollback**: Delete test route
- **Estimated time**: 20 minutes

**Task 24: Create Seed Data Script**
- **Objective**: Add script to populate test data
- **Files to modify/create**: `supabase/seed.sql`
- **Acceptance Criteria**:
  - Creates test user
  - Adds sample tasks and events
  - Can run repeatedly without errors
- **Dependencies**: Task 13-16
- **Rollback**: Delete seed file
- **Estimated time**: 25 minutes

**Task 25: Setup Local Supabase Instance**
- **Objective**: Start local Supabase for development
- **Files to modify/create**: Update `.env.local` with local URLs
- **Acceptance Criteria**:
  - `npx supabase start` works
  - Studio accessible at localhost:54323
  - Can connect from app
- **Dependencies**: Task 12
- **Rollback**: `npx supabase stop`
- **Estimated time**: 20 minutes

---

## Phase 3: Authentication Phase (Tasks 26-40)

**Task 26: Create Auth Layout**
- **Objective**: Build layout for auth pages
- **Files to modify/create**: `app/(auth)/layout.tsx`
- **Acceptance Criteria**:
  - Center-aligned content
  - ClearDay logo/branding visible
  - Responsive design works
- **Dependencies**: Task 5
- **Rollback**: Delete layout file
- **Estimated time**: 20 minutes

**Task 27: Create Login Page Structure**
- **Objective**: Build login page UI
- **Files to modify/create**: `app/(auth)/login/page.tsx`
- **Acceptance Criteria**:
  - Email and password inputs visible
  - Sign in button present
  - Link to signup page works
- **Dependencies**: Task 26, Task 6
- **Rollback**: Delete page file
- **Estimated time**: 25 minutes

**Task 28: Create Signup Page Structure**
- **Objective**: Build signup page UI
- **Files to modify/create**: `app/(auth)/signup/page.tsx`
- **Acceptance Criteria**:
  - Email, password, confirm password fields
  - Create account button present
  - Link to login page works
- **Dependencies**: Task 26, Task 6
- **Rollback**: Delete page file
- **Estimated time**: 25 minutes

**Task 29: Add Form Components**
- **Objective**: Install shadcn form components
- **Files to modify/create**: `components/ui/form.tsx`, `components/ui/input.tsx`, `components/ui/label.tsx`
- **Acceptance Criteria**:
  - Form components installed via shadcn
  - Input styling matches design
  - Form validation ready
- **Dependencies**: Task 4
- **Rollback**: Delete component files
- **Estimated time**: 20 minutes

**Task 30: Create Login Form Component**
- **Objective**: Build reusable login form with validation
- **Files to modify/create**: `components/auth/LoginForm.tsx`
- **Acceptance Criteria**:
  - Email validation works
  - Password required validation
  - Loading state on submit
- **Dependencies**: Task 29
- **Rollback**: Delete component file
- **Estimated time**: 30 minutes

**Task 31: Create Signup Form Component**
- **Objective**: Build signup form with validation
- **Files to modify/create**: `components/auth/SignupForm.tsx`
- **Acceptance Criteria**:
  - Password match validation works
  - Email format validation
  - Error messages display correctly
- **Dependencies**: Task 29
- **Rollback**: Delete component file
- **Estimated time**: 30 minutes

**Task 32: Implement Signup Server Action**
- **Objective**: Create server action for user registration
- **Files to modify/create**: `app/actions/auth.ts`
- **Acceptance Criteria**:
  - Creates user in Supabase Auth
  - Returns success/error properly
  - Profile created via trigger
- **Dependencies**: Task 21, Task 14
- **Rollback**: Delete action file
- **Estimated time**: 25 minutes

**Task 33: Implement Login Server Action**
- **Objective**: Create server action for authentication
- **Files to modify/create**: `app/actions/auth.ts` (add login function)
- **Acceptance Criteria**:
  - Authenticates with Supabase
  - Sets session cookie
  - Returns user data on success
- **Dependencies**: Task 32
- **Rollback**: Remove login function
- **Estimated time**: 25 minutes

**Task 34: Connect Forms to Server Actions**
- **Objective**: Wire up forms to call server actions
- **Files to modify/create**: Update `LoginForm.tsx`, `SignupForm.tsx`
- **Acceptance Criteria**:
  - Forms submit to server actions
  - Success redirects to /today
  - Errors display to user
- **Dependencies**: Task 32, Task 33
- **Rollback**: Revert form components
- **Estimated time**: 25 minutes

**Task 35: Create Auth Context Provider**
- **Objective**: Build context for auth state management
- **Files to modify/create**: `components/auth/AuthProvider.tsx`
- **Acceptance Criteria**:
  - Provides user state to children
  - Handles session refresh
  - TypeScript types correct
- **Dependencies**: Task 21
- **Rollback**: Delete provider file
- **Estimated time**: 30 minutes

**Task 36: Add Middleware for Protected Routes**
- **Objective**: Implement route protection middleware
- **Files to modify/create**: `middleware.ts`
- **Acceptance Criteria**:
  - Redirects to /login if not authenticated
  - Protects /today and /settings routes
  - Allows public routes through
- **Dependencies**: Task 21
- **Rollback**: Delete middleware.ts
- **Estimated time**: 25 minutes

**Task 37: Create Dashboard Layout**
- **Objective**: Build layout for authenticated pages
- **Files to modify/create**: `app/(dashboard)/layout.tsx`
- **Acceptance Criteria**:
  - Navigation sidebar/header present
  - User menu with logout option
  - Protected by auth check
- **Dependencies**: Task 35, Task 36
- **Rollback**: Delete layout file
- **Estimated time**: 30 minutes

**Task 38: Implement Logout Functionality**
- **Objective**: Add logout server action and UI
- **Files to modify/create**: `app/actions/auth.ts` (add logout), `components/layouts/UserMenu.tsx`
- **Acceptance Criteria**:
  - Logout clears session
  - Redirects to landing page
  - All cookies cleared
- **Dependencies**: Task 37
- **Rollback**: Remove logout code
- **Estimated time**: 20 minutes

**Task 39: Add Loading States**
- **Objective**: Create loading UI for auth operations
- **Files to modify/create**: `app/(auth)/loading.tsx`, `components/ui/spinner.tsx`
- **Acceptance Criteria**:
  - Spinner shows during auth operations
  - Buttons disable while loading
  - No UI jumping
- **Dependencies**: Task 6
- **Rollback**: Delete loading files
- **Estimated time**: 20 minutes

**Task 40: Test Full Auth Flow**
- **Objective**: Verify complete authentication works
- **Files to modify/create**: None (testing only)
- **Acceptance Criteria**:
  - Can create new account
  - Can login with credentials
  - Protected routes redirect properly
  - Logout works correctly
- **Dependencies**: Task 26-39
- **Rollback**: N/A (testing task)
- **Estimated time**: 20 minutes

---

## Phase 4: Core Features Phase (Tasks 41-70)

**Task 41: Create Today Page Structure**
- **Objective**: Build main Today screen layout
- **Files to modify/create**: `app/(dashboard)/today/page.tsx`
- **Acceptance Criteria**:
  - Page title shows current date
  - Layout sections for summary, tasks, events
  - Responsive grid layout
- **Dependencies**: Task 37
- **Rollback**: Delete page file
- **Estimated time**: 25 minutes

**Task 42: Create Daily Summary Component**
- **Objective**: Build component for AI-generated summary
- **Files to modify/create**: `components/dashboard/DailySummary.tsx`
- **Acceptance Criteria**:
  - Card displays placeholder text
  - "Your day, already sorted" microcopy
  - Loading skeleton ready
- **Dependencies**: Task 6
- **Rollback**: Delete component
- **Estimated time**: 20 minutes

**Task 43: Create Task List Component**
- **Objective**: Build component to display tasks
- **Files to modify/create**: `components/dashboard/TaskList.tsx`
- **Acceptance Criteria**:
  - Renders list of tasks
  - Checkbox for completion
  - Priority indicators work
- **Dependencies**: Task 6
- **Rollback**: Delete component
- **Estimated time**: 25 minutes

**Task 44: Create Task Item Component**
- **Objective**: Build individual task display component
- **Files to modify/create**: `components/dashboard/TaskItem.tsx`
- **Acceptance Criteria**:
  - Shows title, due time, priority
  - Checkbox toggles completion
  - Edit/delete buttons present
- **Dependencies**: Task 43
- **Rollback**: Delete component
- **Estimated time**: 25 minutes

**Task 45: Implement Fetch Tasks Server Action**
- **Objective**: Create action to get user's tasks
- **Files to modify/create**: `app/actions/tasks.ts`
- **Acceptance Criteria**:
  - Fetches tasks for current user
  - Filters by date if provided
  - Sorts by priority and time
- **Dependencies**: Task 21
- **Rollback**: Delete action file
- **Estimated time**: 25 minutes

**Task 46: Connect Task List to Data**
- **Objective**: Wire TaskList to fetch real tasks
- **Files to modify/create**: Update `TaskList.tsx`, `today/page.tsx`
- **Acceptance Criteria**:
  - Tasks load from database
  - Shows only today's tasks
  - Loading state works
- **Dependencies**: Task 45
- **Rollback**: Revert components
- **Estimated time**: 25 minutes

**Task 47: Create Add Task Dialog**
- **Objective**: Build modal for creating new tasks
- **Files to modify/create**: `components/dashboard/AddTaskDialog.tsx`
- **Acceptance Criteria**:
  - Dialog opens on button click
  - Form with title, date, priority
  - Cancel and Save buttons work
- **Dependencies**: Task 6, Task 29
- **Rollback**: Delete component
- **Estimated time**: 30 minutes

**Task 48: Implement Create Task Server Action**
- **Objective**: Add server action to create tasks
- **Files to modify/create**: `app/actions/tasks.ts` (add createTask)
- **Acceptance Criteria**:
  - Creates task in database
  - Associates with current user
  - Returns new task data
- **Dependencies**: Task 45
- **Rollback**: Remove function
- **Estimated time**: 20 minutes

**Task 49: Connect Add Task to Server**
- **Objective**: Wire up task creation flow
- **Files to modify/create**: Update `AddTaskDialog.tsx`
- **Acceptance Criteria**:
  - Form submits to server action
  - New task appears in list
  - Dialog closes on success
- **Dependencies**: Task 48
- **Rollback**: Revert component
- **Estimated time**: 25 minutes

**Task 50: Implement Complete Task Action**
- **Objective**: Add task completion functionality
- **Files to modify/create**: `app/actions/tasks.ts` (add completeTask)
- **Acceptance Criteria**:
  - Toggles task completion status
  - Updates completed_at timestamp
  - Returns updated task
- **Dependencies**: Task 45
- **Rollback**: Remove function
- **Estimated time**: 20 minutes

**Task 51: Wire Up Task Completion**
- **Objective**: Connect checkbox to completion action
- **Files to modify/create**: Update `TaskItem.tsx`
- **Acceptance Criteria**:
  - Checkbox toggles task status
  - Optimistic update works
  - Strikethrough on completed
- **Dependencies**: Task 50
- **Rollback**: Revert component
- **Estimated time**: 25 minutes

**Task 52: Create Calendar View Component**
- **Objective**: Build basic calendar display
- **Files to modify/create**: `components/dashboard/CalendarView.tsx`
- **Acceptance Criteria**:
  - Shows today's events
  - Time slots visible
  - Event cards display
- **Dependencies**: Task 6
- **Rollback**: Delete component
- **Estimated time**: 30 minutes

**Task 53: Create Event Card Component**
- **Objective**: Build component for event display
- **Files to modify/create**: `components/dashboard/EventCard.tsx`
- **Acceptance Criteria**:
  - Shows event title and time
  - Location if available
  - Duration indicator
- **Dependencies**: Task 6
- **Rollback**: Delete component
- **Estimated time**: 20 minutes

**Task 54: Implement Fetch Events Action**
- **Objective**: Create action to get user's events
- **Files to modify/create**: `app/actions/events.ts`
- **Acceptance Criteria**:
  - Fetches events for date range
  - Sorts by start time
  - Includes all event fields
- **Dependencies**: Task 21
- **Rollback**: Delete action file
- **Estimated time**: 25 minutes

**Task 55: Connect Calendar to Events**
- **Objective**: Wire CalendarView to real data
- **Files to modify/create**: Update `CalendarView.tsx`, `today/page.tsx`
- **Acceptance Criteria**:
  - Events load from database
  - Today's events displayed
  - Time conflicts highlighted
- **Dependencies**: Task 54
- **Rollback**: Revert components
- **Estimated time**: 25 minutes

**Task 56: Create Settings Page Structure**
- **Objective**: Build settings page layout
- **Files to modify/create**: `app/(dashboard)/settings/page.tsx`
- **Acceptance Criteria**:
  - Tabs for different settings sections
  - Profile section visible
  - Privacy section visible
- **Dependencies**: Task 37
- **Rollback**: Delete page file
- **Estimated time**: 25 minutes

**Task 57: Create Privacy Toggle Component**
- **Objective**: Build privacy mode toggle switch
- **Files to modify/create**: `components/privacy/PrivacyToggle.tsx`
- **Acceptance Criteria**:
  - Toggle switch for Local Mode
  - Explanation text displays
  - State persists to profile
- **Dependencies**: Task 6
- **Rollback**: Delete component
- **Estimated time**: 25 minutes

**Task 58: Implement Update Profile Action**
- **Objective**: Create action to update user profile
- **Files to modify/create**: `app/actions/profile.ts`
- **Acceptance Criteria**:
  - Updates profile fields
  - Handles privacy settings
  - Returns updated profile
- **Dependencies**: Task 21
- **Rollback**: Delete action file
- **Estimated time**: 20 minutes

**Task 59: Connect Privacy Settings**
- **Objective**: Wire privacy toggle to backend
- **Files to modify/create**: Update `PrivacyToggle.tsx`, settings page
- **Acceptance Criteria**:
  - Toggle updates database
  - Setting persists on refresh
  - Toast confirms change
- **Dependencies**: Task 58
- **Rollback**: Revert components
- **Estimated time**: 25 minutes

**Task 60: Create Progress Component**
- **Objective**: Build progress display card
- **Files to modify/create**: `components/dashboard/ProgressCard.tsx`
- **Acceptance Criteria**:
  - Shows tasks completed today
  - Shows streak counter
  - Placeholder for CO₂ saved
- **Dependencies**: Task 6
- **Rollback**: Delete component
- **Estimated time**: 25 minutes

**Task 61: Create Nudge Card Component**
- **Objective**: Build component for behavioral nudges
- **Files to modify/create**: `components/nudges/NudgeCard.tsx`
- **Acceptance Criteria**:
  - Card displays nudge message
  - Action button present
  - Dismiss option available
- **Dependencies**: Task 6
- **Rollback**: Delete component
- **Estimated time**: 25 minutes

**Task 62: Add Toast Notifications**
- **Objective**: Install and configure toast component
- **Files to modify/create**: `components/ui/toast.tsx`, `components/ui/toaster.tsx`
- **Acceptance Criteria**:
  - Toast component installed
  - Success/error variants work
  - Auto-dismiss after 3 seconds
- **Dependencies**: Task 4
- **Rollback**: Delete toast files
- **Estimated time**: 20 minutes

**Task 63: Add Toast Provider**
- **Objective**: Set up global toast notifications
- **Files to modify/create**: Update root layout with Toaster
- **Acceptance Criteria**:
  - Toasts appear on actions
  - Success messages for task creation
  - Error messages on failures
- **Dependencies**: Task 62
- **Rollback**: Remove Toaster from layout
- **Estimated time**: 20 minutes

**Task 64: Create Edit Task Dialog**
- **Objective**: Build modal for editing tasks
- **Files to modify/create**: `components/dashboard/EditTaskDialog.tsx`
- **Acceptance Criteria**:
  - Pre-fills with task data
  - Save updates task
  - Delete option available
- **Dependencies**: Task 47
- **Rollback**: Delete component
- **Estimated time**: 30 minutes

**Task 65: Implement Update Task Action**
- **Objective**: Add server action to edit tasks
- **Files to modify/create**: `app/actions/tasks.ts` (add updateTask)
- **Acceptance Criteria**:
  - Updates task in database
  - Validates user ownership
  - Returns updated task
- **Dependencies**: Task 45
- **Rollback**: Remove function
- **Estimated time**: 20 minutes

**Task 66: Implement Delete Task Action**
- **Objective**: Add server action to delete tasks
- **Files to modify/create**: `app/actions/tasks.ts` (add deleteTask)
- **Acceptance Criteria**:
  - Soft deletes task
  - Validates user ownership
  - Returns success status
- **Dependencies**: Task 45
- **Rollback**: Remove function
- **Estimated time**: 20 minutes

**Task 67: Connect Edit/Delete Functions**
- **Objective**: Wire up task editing and deletion
- **Files to modify/create**: Update `EditTaskDialog.tsx`, `TaskItem.tsx`
- **Acceptance Criteria**:
  - Edit button opens dialog
  - Save updates task in list
  - Delete removes from list
- **Dependencies**: Task 65, Task 66
- **Rollback**: Revert components
- **Estimated time**: 25 minutes

**Task 68: Add Keyboard Shortcuts**
- **Objective**: Implement hotkeys for common actions
- **Files to modify/create**: `lib/hooks/useKeyboardShortcuts.ts`
- **Acceptance Criteria**:
  - Cmd/Ctrl+N opens new task
  - Escape closes dialogs
  - / focuses search (placeholder)
- **Dependencies**: Task 47
- **Rollback**: Delete hook file
- **Estimated time**: 25 minutes

**Task 69: Create Mobile Navigation**
- **Objective**: Build responsive nav for mobile
- **Files to modify/create**: `components/layouts/MobileNav.tsx`
- **Acceptance Criteria**:
  - Hamburger menu on mobile
  - Drawer slides from left
  - All nav items accessible
- **Dependencies**: Task 37
- **Rollback**: Delete component
- **Estimated time**: 30 minutes

**Task 70: Add Loading Skeletons**
- **Objective**: Create skeleton loaders for better UX
- **Files to modify/create**: `components/ui/skeleton.tsx`, update components
- **Acceptance Criteria**:
  - Task list shows skeletons
  - Calendar shows placeholders
  - No layout shift on load
- **Dependencies**: Task 4
- **Rollback**: Remove skeleton usage
- **Estimated time**: 25 minutes

---

## Phase 5: Polish Phase (Tasks 71-85)

**Task 71: Add Error Boundaries**
- **Objective**: Implement React error boundaries
- **Files to modify/create**: `app/error.tsx`, `components/ErrorBoundary.tsx`
- **Acceptance Criteria**:
  - Catches component errors
  - Shows user-friendly message
  - Log errors (console for now)
- **Dependencies**: Task 1
- **Rollback**: Delete error files
- **Estimated time**: 25 minutes

**Task 72: Add 404 Page**
- **Objective**: Create not found page
- **Files to modify/create**: `app/not-found.tsx`
- **Acceptance Criteria**:
  - Custom 404 message
  - Link back to home
  - Consistent with design
- **Dependencies**: Task 6
- **Rollback**: Delete not-found.tsx
- **Estimated time**: 15 minutes

**Task 73: Implement Input Validation**
- **Objective**: Add Zod schemas for validation
- **Files to modify/create**: `lib/validations/index.ts`
- **Acceptance Criteria**:
  - Task validation schema works
  - Email validation correct
  - Error messages helpful
- **Dependencies**: Task 2 (zod installed)
- **Rollback**: Delete validation file
- **Estimated time**: 25 minutes

**Task 74: Add Form Error Handling**
- **Objective**: Display validation errors in forms
- **Files to modify/create**: Update form components
- **Acceptance Criteria**:
  - Field-level errors display
  - Form-level errors show
  - Errors clear on correction
- **Dependencies**: Task 73
- **Rollback**: Revert form components
- **Estimated time**: 30 minutes

**Task 75: Add Empty States**
- **Objective**: Create UI for empty data states
- **Files to modify/create**: `components/EmptyState.tsx`, update lists
- **Acceptance Criteria**:
  - "No tasks" message shows
  - "No events" message shows
  - Call-to-action buttons work
- **Dependencies**: Task 6
- **Rollback**: Delete component
- **Estimated time**: 25 minutes

**Task 76: Add Confirmation Dialogs**
- **Objective**: Add delete confirmation modals
- **Files to modify/create**: `components/ui/alert-dialog.tsx`
- **Acceptance Criteria**:
  - Confirms before delete
  - Clear warning message
  - Cancel aborts action
- **Dependencies**: Task 4
- **Rollback**: Remove confirmations
- **Estimated time**: 25 minutes

**Task 77: Optimize Bundle Size**
- **Objective**: Configure Next.js optimization
- **Files to modify/create**: `next.config.js`
- **Acceptance Criteria**:
  - Bundle analyzer works
  - Tree shaking enabled
  - Images optimized
- **Dependencies**: Task 1
- **Rollback**: Revert config
- **Estimated time**: 20 minutes

**Task 78: Add Meta Tags**
- **Objective**: Implement SEO meta tags
- **Files to modify/create**: Update layout.tsx, add metadata
- **Acceptance Criteria**:
  - Open Graph tags present
  - Twitter Card tags work
  - Description accurate
- **Dependencies**: Task 7
- **Rollback**: Remove meta tags
- **Estimated time**: 20 minutes

**Task 79: Add PWA Manifest**
- **Objective**: Create web app manifest
- **Files to modify/create**: `public/manifest.json`, icons
- **Acceptance Criteria**:
  - Manifest validates
  - Icons in multiple sizes
  - Theme color set
- **Dependencies**: Task 1
- **Rollback**: Delete manifest
- **Estimated time**: 25 minutes

**Task 80: Implement Dark Mode**
- **Objective**: Add dark mode toggle
- **Files to modify/create**: `components/ThemeToggle.tsx`, update CSS
- **Acceptance Criteria**:
  - Toggle switches themes
  - Preference persists
  - All components themed
- **Dependencies**: Task 6
- **Rollback**: Remove theme code
- **Estimated time**: 30 minutes

**Task 81: Add Analytics Events**
- **Objective**: Track basic usage events
- **Files to modify/create**: `lib/analytics.ts`
- **Acceptance Criteria**:
  - Page view tracking works
  - Task completion tracked
  - Privacy mode respected
- **Dependencies**: Task 57
- **Rollback**: Delete analytics file
- **Estimated time**: 25 minutes

**Task 82: Add Rate Limiting**
- **Objective**: Implement basic rate limiting
- **Files to modify/create**: Update server actions
- **Acceptance Criteria**:
  - Limits API calls per minute
  - Returns 429 on excess
  - User-friendly error message
- **Dependencies**: Task 32
- **Rollback**: Remove rate limiting
- **Estimated time**: 25 minutes

**Task 83: Add Data Export**
- **Objective**: Let users export their data
- **Files to modify/create**: `app/actions/export.ts`, settings page
- **Acceptance Criteria**:
  - Exports tasks to JSON
  - Download triggers properly
  - Privacy mode noted
- **Dependencies**: Task 56
- **Rollback**: Remove export feature
- **Estimated time**: 30 minutes

**Task 84: Performance Monitoring**
- **Objective**: Add Web Vitals tracking
- **Files to modify/create**: `app/layout.tsx`, `lib/vitals.ts`
- **Acceptance Criteria**:
  - LCP, FID, CLS tracked
  - Console logs in dev
  - No impact on performance
- **Dependencies**: Task 7
- **Rollback**: Remove vitals code
- **Estimated time**: 20 minutes

**Task 85: Final Testing & Polish**
- **Objective**: Complete end-to-end testing
- **Files to modify/create**: Update any issues found
- **Acceptance Criteria**:
  - All features work together
  - No console errors
  - Mobile experience smooth
  - Forms validate properly
- **Dependencies**: All previous tasks
- **Rollback**: Fix specific issues
- **Estimated time**: 30 minutes

---

## Completion Checklist

### Must Have for MVP Launch
- [ ] User can sign up and login
- [ ] User can view Today screen
- [ ] User can create, edit, complete, delete tasks
- [ ] User can view calendar events (manual creation)
- [ ] Privacy toggle works
- [ ] Mobile responsive
- [ ] Error handling present
- [ ] Loading states implemented

### Nice to Have (Post-MVP)
- [ ] AI summaries (requires Edge Functions)
- [ ] Behavioral nudges
- [ ] CO₂ tracking
- [ ] Google Calendar integration
- [ ] Stripe payments
- [ ] Households
- [ ] Habit tracking
- [ ] Advanced reminders

---

## Testing Strategy

After each task:
1. Run `npm run dev` - ensure no compile errors
2. Test the specific feature added
3. Check for console errors
4. Verify database changes (if applicable)
5. Test on mobile viewport
6. Commit to git

## Emergency Rollback Procedure

If a task breaks the application:
1. Check the specific rollback steps for that task
2. If git initialized: `git reset --hard HEAD~1`
3. If database affected: Restore from backup or re-run migrations
4. If dependencies affected: Delete node_modules and reinstall
5. Clear browser cache and cookies
6. Restart development server

---

## Notes for AI Engineer Collaboration

1. **Always test after each task** - Don't proceed if something is broken
2. **Commit frequently** - After every 2-3 successful tasks minimum
3. **Read the acceptance criteria** - These are your definition of done
4. **Check dependencies** - Don't skip ahead in the task list
5. **Use the rollback steps** - If something goes wrong, undo and try again
6. **Ask for clarification** - If a task seems unclear, discuss before implementing
7. **Keep the architecture.md handy** - Reference it for technical details

This plan progresses from zero to a working MVP in approximately 30-40 hours of focused development.
