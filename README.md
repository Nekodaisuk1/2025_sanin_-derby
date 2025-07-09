# election-derby

参院選の議席予測を投稿し、みんなの平均から計算した "オッズ" をリアルタイムで表示するアプリです。

## セットアップ

```bash
npm install
cp .env.local.example .env.local # Supabase URL と ANON KEY を設定
npm run dev
```

### Supabase

`sql/init.sql` を Supabase の SQL エディタで実行してください。

### デプロイ

Vercel にデプロイする場合は `.env` の値を同様に設定してください。
