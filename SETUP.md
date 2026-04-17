# Platform Setup Guide

Steps to provision the external services and wire them to the application.

## 1. Supabase

1. Create a new Supabase project.
2. Open the SQL Editor and run `supabase/schema.sql`.
3. Confirm both tables exist: `weather_snapshots` and `user_cities`.
4. In **Database → Replication**, verify `weather_snapshots` is included in
   the Realtime publication.
5. In **Project Settings → API**, copy the Project URL, `anon` key, and
   `service_role` key.

## 2. Clerk

1. Create a new application at [clerk.com](https://clerk.com).
2. Choose your sign-in methods (Email, Google, etc.).
3. In **API Keys**, copy the Publishable Key and Secret Key.

## 3. Local Environment Files

Create `apps/web/.env.local` from the example and fill in all values:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
```

Create `apps/worker/.env` from the example:

```
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

## 4. Vercel (frontend)

1. Create a new Vercel project and import the GitHub repository.
2. Set the root directory to `apps/web`.
3. Set the install command to `npm install --prefix=../..`.
4. Add all five environment variables from `apps/web/.env.local`.

## 5. Railway (worker)

1. Create a new Railway project and connect the GitHub repository.
2. Set the root directory to `apps/worker`.
3. Add the two environment variables from `apps/worker/.env`.
