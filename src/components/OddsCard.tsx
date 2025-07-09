'use client';
import useSWR from 'swr';
import { PARTIES } from '../lib/parties';
import { motion } from 'framer-motion';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function OddsCard() {
  const { data } = useSWR('/api/odds', fetcher, { refreshInterval: 10000 });

  if (!data) return <p>Loading odds...</p>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mt-6 border p-4 rounded bg-white"
    >
      <h2 className="font-bold mb-2">オッズ (samples: {data.totalSamples})</h2>
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th className="text-left">党</th>
            <th>平均</th>
            <th>SD</th>
            <th>O/U</th>
          </tr>
        </thead>
        <tbody>
          {PARTIES.map((p) => {
            const o = data.odds[p];
            if (!o) return null;
            return (
              <tr key={p} className="border-t">
                <td>{p}</td>
                <td className="text-center">{o.avg.toFixed(1)}</td>
                <td className="text-center">{o.sd.toFixed(1)}</td>
                <td className="text-center">{o.over50}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </motion.div>
  );
}
