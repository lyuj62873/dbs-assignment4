'use client';

import { useEffect, useState, useRef } from 'react';
import { useUser, SignInButton } from '@clerk/nextjs';
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

type PinnedCity = { city: string; latitude: number; longitude: number };
type LiveWeather = { city: string; temperature: number; windspeed: number; weather_code: number };

async function fetchWeatherForCoords(latitude: number, longitude: number): Promise<Omit<LiveWeather, 'city'> | null> {
  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
    );
    const { current_weather: w } = await res.json();
    return { temperature: w.temperature, windspeed: w.windspeed, weather_code: w.weathercode };
  } catch { return null; }
}

function WeatherCard({ city, temperature, windspeed, weather_code, updated_at, onRemove }: {
  city: string; temperature: number; windspeed: number;
  weather_code: number; updated_at?: string; onRemove?: () => void;
}) {
  return (
    <article className="card">
      {onRemove && <button className="card-remove" onClick={onRemove} aria-label="Remove">×</button>}
      <h2>{city}</h2>
      <p className="temp">{temperature}°C</p>
      <p>{WMO_LABELS[weather_code] ?? `Code ${weather_code}`}</p>
      <p className="meta">Wind {windspeed} km/h</p>
      {updated_at && <p className="meta">{new Date(updated_at).toLocaleTimeString()}</p>}
    </article>
  );
}

export default function WeatherDashboard({ initial }: { initial: WeatherSnapshot[] }) {
  const { isSignedIn, isLoaded } = useUser();
  const [rows, setRows] = useState<WeatherSnapshot[]>(initial.slice(0, 4));
  const [pinned, setPinned] = useState<PinnedCity[]>([]);
  const [pinnedWeather, setPinnedWeather] = useState<Record<string, LiveWeather>>({});

  const [query, setQuery] = useState('');
  const [searchResult, setSearchResult] = useState<(LiveWeather & { latitude: number; longitude: number }) | null>(null);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Load pinned cities from DB when user signs in
  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) { setPinned([]); setPinnedWeather({}); return; }

    fetch('/api/cities')
      .then((r) => r.json())
      .then((cities: PinnedCity[]) => {
        setPinned(cities);
        cities.forEach(async ({ city, latitude, longitude }) => {
          const w = await fetchWeatherForCoords(latitude, longitude);
          if (w) setPinnedWeather((prev) => ({ ...prev, [city]: { city, ...w } }));
        });
      });
  }, [isSignedIn, isLoaded]);

  // Realtime updates for the 4 default cities
  useEffect(() => {
    const channel = supabase
      .channel('weather_snapshots')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'weather_snapshots' }, (payload) => {
        const updated = payload.new as WeatherSnapshot;
        setRows((prev) => prev.map((r) => (r.city === updated.city ? updated : r)));
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  async function handleSearch() {
    const name = query.trim();
    if (!name) return;
    setSearching(true);
    setSearchError('');
    setSearchResult(null);
    try {
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=1&language=en&format=json`
      );
      const geoData = await geoRes.json();
      if (!geoData.results?.length) throw new Error(`No results for "${name}"`);
      const { name: cityName, latitude, longitude } = geoData.results[0];
      const w = await fetchWeatherForCoords(latitude, longitude);
      if (!w) throw new Error('Could not fetch weather data');
      setSearchResult({ city: cityName, latitude, longitude, ...w });
    } catch (err: unknown) {
      setSearchError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSearching(false);
    }
  }

  async function addPinned() {
    if (!searchResult) return;
    const { city, latitude, longitude } = searchResult;
    if (pinned.some((p) => p.city === city)) return;
    await fetch('/api/cities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ city, latitude, longitude }),
    });
    setPinned((prev) => [...prev, { city, latitude, longitude }]);
    setPinnedWeather((prev) => ({ ...prev, [city]: searchResult }));
  }

  async function removePinned(city: string) {
    await fetch(`/api/cities?city=${encodeURIComponent(city)}`, { method: 'DELETE' });
    setPinned((prev) => prev.filter((p) => p.city !== city));
    setPinnedWeather((prev) => { const next = { ...prev }; delete next[city]; return next; });
  }

  const isAlreadyPinned = searchResult ? pinned.some((p) => p.city === searchResult.city) : false;

  return (
    <>
      <section className="card-grid">
        {rows.map((row) => <WeatherCard key={row.city} {...row} />)}
      </section>

      <div className="search-bar">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search any city…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button onClick={handleSearch} disabled={searching}>
          {searching ? 'Searching…' : 'Search'}
        </button>
      </div>

      {searchError && <p className="search-error">{searchError}</p>}

      {searchResult && (
        <section className="search-result">
          <div className="search-result-header">
            <p className="eyebrow">Search result</p>
            {isLoaded && (
              isSignedIn ? (
                !isAlreadyPinned && (
                  <button className="add-btn" onClick={addPinned}>+ Add to My Dashboard</button>
                )
              ) : (
                <SignInButton mode="modal">
                  <button className="add-btn">Sign in to save</button>
                </SignInButton>
              )
            )}
          </div>
          <div className="card-grid card-grid--single">
            <WeatherCard {...searchResult} />
          </div>
        </section>
      )}

      {isSignedIn && pinned.length > 0 && (
        <section className="my-cities">
          <p className="eyebrow">My Cities</p>
          <div className="card-grid card-grid--auto">
            {pinned.map(({ city }) => {
              const w = pinnedWeather[city];
              return w ? (
                <WeatherCard key={city} {...w} onRemove={() => removePinned(city)} />
              ) : (
                <article key={city} className="card card--loading">
                  <h2>{city}</h2>
                  <p className="meta">Loading…</p>
                </article>
              );
            })}
          </div>
        </section>
      )}
    </>
  );
}
