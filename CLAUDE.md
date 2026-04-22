# Assignment 4 Architecture

This repository contains a multi-service weather monitoring system built with the
same architectural pattern used in class: an external data source, a background
worker, a hosted database with realtime updates, and a deployed frontend.

## Services

- `apps/web`: Next.js + Tailwind CSS frontend deployed to Vercel
- `apps/worker`: Node.js background worker deployed to Railway
- `Supabase`: PostgreSQL database and Realtime subscriptions
- `Open-Meteo`: external weather data API

## Data Flow

1. The worker polls Open-Meteo on a fixed interval for the configured cities.
2. The worker normalizes the current weather data and writes it to Supabase.
3. Supabase Realtime broadcasts row changes to subscribed clients.
4. The frontend loads the latest weather snapshots and updates live as new data arrives.
5. Personalized city lists are stored in `user_cities` and accessed through
   server-side routes backed by the Supabase service role.

## Application Focus

The system is designed around a compact dashboard experience:

- current conditions for a fixed set of cities
- server-side persistence of weather snapshots
- live frontend updates through Supabase Realtime
- personalized saved cities per authenticated user
- separate deployment targets for frontend and background processing

## Deployment Targets

- Vercel for the frontend
- Railway for the worker
- Supabase for persistence and Realtime
