# Local Supabase Setup Guide

## Prerequisites

1. **Docker Desktop** must be installed and running
2. **Supabase CLI** should be installed (already done via `npm install`)

## Setup Steps

### 1. Start Docker Desktop
- Open Docker Desktop application
- Wait for it to fully start (green status indicator)

### 2. Start Local Supabase Instance
```bash
npx supabase start
```

This will:
- Start PostgreSQL database on port 5432
- Start Supabase API on port 54321
- Start Supabase Studio on port 54323
- Start Auth service on port 54324
- Start Storage service on port 54325
- Start Realtime service on port 54326

### 3. Update Environment Variables

When local Supabase is running, update your `.env.local` file:

```bash
# Comment out production URLs
# NEXT_PUBLIC_SUPABASE_URL=https://nxmvmzpchtkbyhxmlavn.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# Uncomment local URLs
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU
```

### 4. Run Database Migrations
```bash
npx supabase db reset
```

This will apply all migrations and seed data.

### 5. Access Supabase Studio
Open your browser and go to: http://localhost:54323

## Testing Local Instance

Run the local connection tests:
```bash
npx playwright test tests/db/local-connection.spec.ts
```

## Stopping Local Instance

```bash
npx supabase stop
```

## Troubleshooting

### Docker Desktop Not Running
- Start Docker Desktop manually
- Wait for it to fully initialize
- Try `npx supabase start` again

### Port Conflicts
If ports are already in use:
```bash
npx supabase stop
npx supabase start
```

### Database Reset
To reset the local database:
```bash
npx supabase db reset
```

## Local URLs

- **API**: http://127.0.0.1:54321
- **Studio**: http://localhost:54323
- **Database**: localhost:5432
- **Auth**: http://127.0.0.1:54324
- **Storage**: http://127.0.0.1:54325
- **Realtime**: http://127.0.0.1:54326

## Default Credentials

- **Database Password**: `postgres`
- **Studio Password**: `postgres`
