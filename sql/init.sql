create table if not exists predictions (
  id uuid primary key default gen_random_uuid(),
  seats jsonb not null,
  created_at timestamptz default now()
);
alter table predictions
  add column if not exists user_id uuid references auth.users(id) on delete cascade;

create unique index if not exists predictions_user_idx on predictions(user_id);

alter table predictions enable row level security;
create policy "owner" on predictions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table if not exists actual_results (
  id smallint primary key default 1,
  seats jsonb not null,
  created_at timestamptz default now()
);
