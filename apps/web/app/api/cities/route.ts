import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

function serverSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json([]);

  const { data } = await serverSupabase()
    .from('user_cities')
    .select('city, latitude, longitude')
    .eq('user_id', userId)
    .order('added_at');

  return NextResponse.json(data ?? []);
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { city, latitude, longitude } = await req.json();
  const { error } = await serverSupabase()
    .from('user_cities')
    .upsert({ user_id: userId, city, latitude, longitude }, { onConflict: 'user_id,city' });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const city = new URL(req.url).searchParams.get('city');
  if (!city) return NextResponse.json({ error: 'city required' }, { status: 400 });

  await serverSupabase()
    .from('user_cities')
    .delete()
    .eq('user_id', userId)
    .eq('city', city);

  return NextResponse.json({ ok: true });
}
