# Platform Setup Guide

This document lists the external platform configuration required before the
application code can be connected and deployed.

## 1. Supabase

1. Create a new Supabase project.
2. Open the SQL Editor.
3. Run the SQL in `supabase/schema.sql`.
4. Confirm that the `weather_snapshots` table exists.
5. In `Database -> Replication`, verify that `weather_snapshots` is included in
   Realtime replication.
6. In `Project Settings -> API`, copy:
   - Project URL
   - `anon` public key
   - `service_role` key

## 2. Local Environment Files

Create these files from the provided examples:

- `apps/web/.env.local`
- `apps/worker/.env`

Fill them with the Supabase values:

- `apps/web/.env.local`
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `apps/worker/.env`
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`

## 3. Vercel

Vercel is not required for local development in this phase, but setting it up
now avoids rework later.

1. Create a new Vercel project and import this GitHub repository.
2. Set the project root to `apps/web`.
3. Add these environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Do not deploy until the frontend phase is complete.

## 4. Railway

Railway is also optional for this phase, but it is useful to prepare the
service entry early.

1. Create a new Railway project and connect this GitHub repository.
2. Set the root directory to `apps/worker`.
3. Add these environment variables:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Do not start the service until the worker phase is complete.
