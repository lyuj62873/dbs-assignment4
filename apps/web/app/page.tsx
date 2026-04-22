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
    <main className="mx-auto w-[min(1080px,calc(100vw-32px))] px-0 py-16 md:py-20">
      <section className="rounded-[28px] border border-black/10 bg-white/75 p-8 backdrop-blur md:p-10">
        <p className="mb-2 text-[0.85rem] uppercase tracking-[0.2em] text-emerald-800">
          Assignment 4
        </p>
        <h1 className="m-0 text-[clamp(2.5rem,7vw,4.75rem)] leading-[0.95]">
          Realtime Weather Dashboard
        </h1>
        <p className="mt-5 max-w-[42rem] text-[1.1rem] leading-7 text-slate-600">
          Live conditions updated every minute via Open-Meteo, stored in
          Supabase, and streamed to this page in real time.
        </p>
      </section>
      <WeatherDashboard initial={snapshots} />
    </main>
  );
}
