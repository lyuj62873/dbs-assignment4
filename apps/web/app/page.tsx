import { createClient } from '@supabase/supabase-js';
import WeatherDashboard from '../components/WeatherDashboard';
import { WeatherSnapshot } from '../lib/supabase';

async function getSnapshots(): Promise<WeatherSnapshot[]> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data } = await supabase
    .from('weather_snapshots')
    .select('*')
    .order('city');
  return (data as WeatherSnapshot[]) ?? [];
}

export default async function HomePage() {
  const snapshots = await getSnapshots();

  return (
    <main className="page-shell">
      <section className="hero">
        <p className="eyebrow">Assignment 4</p>
        <h1>Realtime Weather Dashboard</h1>
        <p className="lede">
          Live conditions updated every minute via Open-Meteo, stored in
          Supabase, and streamed to this page in real time.
        </p>
      </section>
      <WeatherDashboard initial={snapshots} />
    </main>
  );
}
