import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';
import { TOTAL_SEATS, CLOSE_AT } from '@/lib/constants';
import { PARTIES } from '@/lib/parties';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ElectionDerbyApp() {
  const [user, setUser] = useState<any>(null);
  const [seats, setSeats] = useState<Record<string, number>>(
    PARTIES.reduce((acc, p) => ({ ...acc, [p]: 0 }), {})
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

  const signIn = async () => {
    const email = prompt('メールアドレスを入力してください');
    if (!email) return;
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) alert(error.message);
    else alert('Magic-link を送信しました。メールを確認してください。');
  };
  const signOut = () => supabase.auth.signOut();

  const total = Object.values(seats).reduce((s, n) => s + Number(n || 0), 0);
  const remaining = TOTAL_SEATS - total;
  const isExact = remaining === 0;
  const isClosed = Date.now() > CLOSE_AT.getTime();

  const handleChange = (p: string, v: string) => {
    if (/^\d*$/.test(v)) setSeats({ ...seats, [p]: Number(v) });
  };

  const submit = async () => {
    if (!user || !isExact || isClosed) return;
    setLoading(true);
    const { error } = await supabase
      .from('predictions')
      .upsert({ user_id: user.id, seats }, { onConflict: 'user_id' });
    setLoading(false);
    if (error) alert('保存失敗: ' + error.message);
    else alert('送信完了（再送信＝上書き）');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6 gap-6">
      <motion.h1 initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold">
        参院選ダービー：議席予想
      </motion.h1>

      <div className="mb-4">
        {user ? (
          <p className="text-sm">
            {user.email} <Button variant="link" onClick={signOut}>ログアウト</Button>
          </p>
        ) : (
          <Button onClick={signIn}>メールでログイン</Button>
        )}
      </div>

      {isClosed && (
        <p className="text-red-600 font-semibold">
          投票は締め切りました（{CLOSE_AT.toLocaleString('ja-JP')}）
        </p>
      )}

      <Card className="w-full max-w-4xl shadow-lg">
        <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {PARTIES.map((p) => (
            <div key={p} className="flex items-center gap-2">
              <label className="w-40 text-sm font-medium truncate" htmlFor={p}>
                {p}
              </label>
              <Input
                id={p}
                type="number"
                value={seats[p]}
                min={0}
                onChange={(e) => handleChange(p, e.target.value)}
                disabled={isClosed}
                className="flex-1"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="text-lg font-semibold">
        合計：{total}／{TOTAL_SEATS}
        {isExact ? (
          <span className="ml-2 text-green-600">✅</span>
        ) : (
          <span className="ml-2 text-red-600">残り {Math.abs(remaining)}</span>
        )}
      </div>

      {user ? (
        <Button disabled={!isExact || isClosed || loading} onClick={submit} className="mt-2">
          {loading ? '送信中…' : '予想を送信 / 上書き'}
        </Button>
      ) : (
        <p className="text-sm text-gray-500 mt-2">ログイン後に送信できます</p>
      )}
    </div>
  );
}
