# Assignment 4: Realtime Weather Dashboard

A deployed multi-service system that collects live weather data and streams
updates to a Next.js frontend in real time.

## Architecture

| Layer | Technology | Platform |
|-------|-----------|----------|
| External data | Open-Meteo API | — |
| Background worker | Node.js | Railway |
| Database + Realtime | PostgreSQL + Supabase Realtime | Supabase |
| Authentication | Clerk | Clerk |
| Frontend | Next.js 15 + Tailwind CSS 4 | Vercel |

## How it works

1. The worker runs on Railway and polls Open-Meteo every 60 seconds for current
   conditions across five cities.
2. Each poll upserts a row in the `weather_snapshots` table (keyed by city name).
3. Supabase Realtime broadcasts the row change to all connected clients.
4. The Next.js frontend loads the latest snapshots server-side on first render,
   then subscribes to Realtime so the UI updates live without a page refresh.
5. Authenticated users can pin any city to a personal dashboard stored in
   the `user_cities` table; each user's selection is isolated by their Clerk
   user ID, protected by RLS, and persists across devices.

## Features

- Live weather cards for Chicago, New York, Los Angeles, London, and Tokyo
- Search any city in the world — weather is fetched on demand from Open-Meteo
- Sign in with Clerk to pin cities to a personal dashboard backed by Supabase
- Pinned cities reload automatically on every visit

## Project Structure

```text
.
├── supabase/
│   └── schema.sql              # weather_snapshots + user_cities tables
└── apps/
    ├── web/                    # Next.js frontend (Vercel)
    │   ├── app/
    │   │   ├── layout.tsx      # ClerkProvider + site header
    │   │   ├── page.tsx        # server component — fetches initial snapshots
    │   │   ├── globals.css
    │   │   └── api/cities/
    │   │       └── route.ts    # GET / POST / DELETE for pinned cities
    │   ├── components/
    │   │   └── WeatherDashboard.tsx
    │   └── lib/
    │       └── supabase.ts
    └── worker/                 # polling worker (Railway)
        └── index.js            # Open-Meteo → Supabase upsert loop
```

## Environment Variables

See `SETUP.md` for the full setup guide and `apps/web/.env.local.example` for
the complete list of required variables.
