# Assignment 4: Realtime Weather Dashboard

This project is a deployed multi-service system that monitors live weather data
and displays updates in real time.

## Architecture

- External data source: Open-Meteo
- Background worker: Node.js service on Railway
- Database and realtime layer: Supabase
- Frontend: Next.js on Vercel

The worker polls live weather conditions, writes normalized snapshots to the
database, and the frontend subscribes to realtime database changes so the UI can
update without a manual refresh.

## Project Structure

```text
.
├── CLAUDE.md
├── README.md
├── package.json
└── apps
    ├── web
    └── worker
```

## Implementation Phases

1. Scaffold the monorepo and define the architecture
2. Configure Supabase schema, Realtime, and environment variables
3. Build the frontend dashboard in Next.js
4. Implement the polling worker and database writes
5. Deploy the frontend and worker to their target platforms
