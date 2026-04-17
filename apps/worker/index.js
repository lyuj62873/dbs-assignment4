import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const CITIES = [
  { city: 'Chicago',     latitude: 41.87810, longitude: -87.62980 },
  { city: 'New York',    latitude: 40.71280, longitude: -74.00600 },
  { city: 'Los Angeles', latitude: 34.05220, longitude: -118.24370 },
  { city: 'London',      latitude: 51.50740, longitude: -0.12780 },
  { city: 'Tokyo',       latitude: 35.67620, longitude: 139.65030 },
];

const INTERVAL_MS = 60_000;

async function fetchWeather({ latitude, longitude }) {
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return data.current_weather;
}

async function poll() {
  console.log(`[${new Date().toISOString()}] polling ${CITIES.length} cities`);
  for (const { city, latitude, longitude } of CITIES) {
    try {
      const w = await fetchWeather({ latitude, longitude });
      const { error } = await supabase.from('weather_snapshots').upsert(
        {
          city,
          latitude,
          longitude,
          temperature: w.temperature,
          windspeed: w.windspeed,
          weather_code: w.weathercode,
          observed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'city' }
      );
      if (error) throw error;
      console.log(`  ✓ ${city}: ${w.temperature}°C  wind ${w.windspeed} km/h`);
    } catch (err) {
      console.error(`  ✗ ${city}:`, err.message);
    }
  }
}

poll();
setInterval(poll, INTERVAL_MS);
