import { createClient } from '@supabase/supabase-js';
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  const { data: actual } = await supabase.from('actual_results').select('seats').eq('id', 1).single();
  if (!actual) return Response.json({ status: 'waiting' });

  const act = actual.seats as Record<string, number>;
  const { data: preds } = await supabase.from('predictions').select('user_id, seats, created_at');

  const ranking = preds!.map((r) => {
    const seats = r.seats as Record<string, number>;
    const error = Object.keys(act).reduce(
      (sum, p) => sum + Math.abs((seats[p] ?? 0) - act[p]),
      0
    );
    return { ...r, error };
  }).sort((a, b) => a.error - b.error);

  return Response.json({ status: 'ok', ranking });
}
