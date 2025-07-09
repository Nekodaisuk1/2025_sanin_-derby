'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { PARTIES, TOTAL_SEATS } from '../lib/parties';
import OddsCard from './OddsCard';
import { motion } from 'framer-motion';

export default function PartyForm() {
  const [seats, setSeats] = useState<Record<string, number>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('draft');
      if (saved) return JSON.parse(saved);
    }
    return {};
  });

  const total = PARTIES.reduce((sum, p) => sum + (seats[p] || 0), 0);
  const remaining = TOTAL_SEATS - total;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('draft', JSON.stringify(seats));
    }
  }, [seats]);

  const handleSubmit = async () => {
    await supabase.from('predictions').insert({ seats });
    alert('送信しました');
  };

  const copy = () => {
    navigator.clipboard.writeText(JSON.stringify({ seats }));
  };

  return (
    <div className="space-y-4">
      {PARTIES.map((p) => (
        <div key={p} className="flex items-center gap-2">
          <label className="w-32">{p}</label>
          <input
            type="number"
            min={0}
            value={seats[p] || ''}
            onChange={(e) =>
              setSeats({ ...seats, [p]: Number(e.target.value) })
            }
            className="border p-1 w-24"
          />
        </div>
      ))}
      <p>合計: {total} / {TOTAL_SEATS} (残り {remaining})</p>
      <div className="flex gap-2">
        <button
          onClick={copy}
          disabled={total !== TOTAL_SEATS}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >コピー</button>
        <button
          onClick={handleSubmit}
          className="px-3 py-1 border rounded"
        >Submit</button>
      </div>
      <OddsCard />
    </div>
  );
}
