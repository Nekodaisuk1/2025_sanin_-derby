create table if not exists predictions (
  id uuid primary key default gen_random_uuid(),
  seats jsonb not null,
  created_at timestamptz default now()
);
