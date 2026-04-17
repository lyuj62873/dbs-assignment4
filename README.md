# Assignment 4: Realtime Weather Dashboard

A deployed multi-service system that collects live weather data and streams
updates to a Next.js frontend in real time.

## Architecture

| Layer | Technology | Platform |
|-------|-----------|----------|
| External data | Open-Meteo API | — |
| Background worker | Node.js | Railway |
| Database + Realtime | PostgreSQL + Supabase Realtime | Supabase |
| Frontend | Next.js 15 | Vercel |

## How it works

1. The worker runs on Railway and polls Open-Meteo every 60 seconds for current
   conditions across five cities.
2. Each poll upserts a row in the `weather_snapshots` table (keyed by city name).
3. Supabase Realtime broadcasts the row change to all connected clients.
4. The Next.js frontend loads the latest snapshots server-side on first render,
   then subscribes to Realtime so the UI updates live without a page refresh.

## Features

- Live weather cards for Chicago, New York, Los Angeles, London, and Tokyo
- Search any city in the world — weather is fetched on demand from Open-Meteo
- Pin cities to a personal dashboard that persists across sessions via
  `localStorage`; each visitor's selection is independent

## Project Structure

```text
.
├── supabase/
│   └── schema.sql          # table definition, RLS policy, Realtime publication
└── apps/
    ├── web/                # Next.js frontend (Vercel)
    │   ├── app/
    │   │   ├── layout.tsx
    │   │   ├── page.tsx    # server component — fetches initial snapshots
    │   │   └── globals.css
    │   ├── components/
    │   │   └── WeatherDashboard.tsx  # client component — Realtime + search + pins
    │   └── lib/
    │       └── supabase.ts
    └── worker/             # polling worker (Railway)
        └── index.js        # Open-Meteo → Supabase upsert loop
```

## Environment Variables

**`apps/web/.env.local`**
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

**`apps/worker/.env`**
```
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```
