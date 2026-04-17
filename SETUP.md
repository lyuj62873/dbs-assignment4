# Platform Setup Guide

Steps to provision the external services and wire them to the application.

## 1. Supabase

1. Create a new Supabase project.
2. Open the SQL Editor and run `supabase/schema.sql`.
3. Confirm the `weather_snapshots` table exists with RLS enabled.
4. In **Database → Replication**, verify `weather_snapshots` is included in
   the Realtime publication.
5. In **Project Settings → API**, copy the Project URL, `anon` key, and
   `service_role` key.

## 2. Local Environment Files

Create the following files from the provided examples and fill in the
Supabase values:

**`apps/web/.env.local`**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**`apps/worker/.env`**
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## 3. Vercel (frontend)

1. Create a new Vercel project and import the GitHub repository.
2. Set the root directory to `apps/web`.
3. Set the install command to `npm install --prefix=../..`.
4. Add the environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 4. Railway (worker)

1. Create a new Railway project and connect the GitHub repository.
2. Set the root directory to `apps/worker`.
3. Add the environment variables:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
