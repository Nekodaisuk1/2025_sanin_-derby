import useSWR from 'swr';
import { Card, CardContent } from '@/components/ui/card';

const fetcher = (u: string) => fetch(u).then((r) => r.json());

export default function Ranking() {
  const { data } = useSWR('/api/ranking', fetcher, { refreshInterval: 30000 });

  if (!data) return <p>読み込み中...</p>;
  if (data.status === 'waiting') return <p>開票結果が未登録です</p>;

  return (
    <div className="min-h-screen flex flex-col items-center p-6 gap-6">
      <h1 className="text-2xl font-bold">ランキング</h1>
      <Card className="w-full max-w-3xl">
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-1 text-left">順位</th>
                <th className="py-1 text-left">ユーザーID</th>
                <th className="py-1 text-left">誤差</th>
              </tr>
            </thead>
            <tbody>
              {data.ranking.map((r: any, i: number) => (
                <tr key={r.user_id} className="border-b">
                  <td className="py-1">{i + 1}</td>
                  <td className="py-1">{r.user_id.slice(0, 8)}</td>
                  <td className="py-1">{r.error}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
