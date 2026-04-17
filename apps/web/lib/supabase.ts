import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export type WeatherSnapshot = {
  city: string;
  latitude: number;
  longitude: number;
  temperature: number;
  windspeed: number;
  weather_code: number;
  observed_at: string;
  updated_at: string;
};
