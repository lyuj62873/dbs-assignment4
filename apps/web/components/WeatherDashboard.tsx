'use client';

import { useEffect, useState } from 'react';
import { supabase, WeatherSnapshot } from '../lib/supabase';

const WMO_LABELS: Record<number, string> = {
  0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
  45: 'Fog', 48: 'Icy fog',
  51: 'Light drizzle', 53: 'Drizzle', 55: 'Heavy drizzle',
  61: 'Light rain', 63: 'Rain', 65: 'Heavy rain',
  71: 'Light snow', 73: 'Snow', 75: 'Heavy snow',
  80: 'Showers', 81: 'Rain showers', 82: 'Violent showers',
  95: 'Thunderstorm', 96: 'Thunderstorm w/ hail', 99: 'Thunderstorm w/ heavy hail',
};

export default function WeatherDashboard({ initial }: { initial: WeatherSnapshot[] }) {
  const [rows, setRows] = useState<WeatherSnapshot[]>(initial);

  useEffect(() => {
    const channel = supabase
      .channel('weather_snapshots')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'weather_snapshots' },
        (payload) => {
          const updated = payload.new as WeatherSnapshot;
          setRows((prev) =>
            prev.some((r) => r.city === updated.city)
              ? prev.map((r) => (r.city === updated.city ? updated : r))
              : [...prev, updated]
          );
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  if (rows.length === 0) {
    return <p className="lede">Waiting for weather data…</p>;
  }

  return (
    <section className="card-grid">
      {rows.map((row) => (
        <article key={row.city} className="card">
          <h2>{row.city}</h2>
          <p className="temp">{row.temperature}°C</p>
          <p>{WMO_LABELS[row.weather_code] ?? `Code ${row.weather_code}`}</p>
          <p className="meta">Wind {row.windspeed} km/h</p>
          <p className="meta">
            {new Date(row.updated_at).toLocaleTimeString()}
          </p>
        </article>
      ))}
    </section>
  );
}
