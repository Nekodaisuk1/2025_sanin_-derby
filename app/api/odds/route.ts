import { supabase } from '../../../src/lib/supabase';
import { PARTIES } from '../../../src/lib/parties';
import { NextResponse } from 'next/server';

export const revalidate = 0;

export async function GET() {
  const { data, error } = await supabase
    .from('predictions')
    .select('seats');
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  const rows = data || [];
  const odds: Record<string, { avg: number; sd: number; over50: number }> = {};
  PARTIES.forEach((p) => {
    const arr = rows.map((r) => r.seats[p] || 0);
    if (arr.length === 0) return;
    const n = arr.length;
    const mean = arr.reduce((a, b) => a + b, 0) / n;
    const sd = Math.sqrt(
      arr.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / n
    );
    const prob = arr.filter((v) => v > mean).length / n;
    const oddsVal = prob === 0 ? 0 : +(1 / prob).toFixed(2);
    odds[p] = { avg: mean, sd, over50: oddsVal };
  });
  const res = NextResponse.json({ odds, totalSamples: rows.length });
  res.headers.set('Cache-Control', 's-maxage=30, stale-while-revalidate=60');
  return res;
}
