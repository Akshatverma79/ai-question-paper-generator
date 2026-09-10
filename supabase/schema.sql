-- Run this in the Supabase SQL editor (Project > SQL Editor > New query)

-- Table: question_papers
create table if not exists public.question_papers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  subject text not null,
  grade_level text,
  topics text,
  total_marks int not null default 0,
  duration_minutes int not null default 60,
  difficulty text not null default 'mixed', -- easy | medium | hard | mixed
  question_types jsonb not null default '[]'::jsonb, -- e.g. ["mcq","short","long","true_false","fill_blank"]
  questions jsonb not null default '[]'::jsonb, -- generated question objects
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.question_papers enable row level security;

-- Users can only see, insert, update, delete their own papers
create policy "Users can view own papers"
  on public.question_papers for select
  using (auth.uid() = user_id);

create policy "Users can insert own papers"
  on public.question_papers for insert
  with check (auth.uid() = user_id);

create policy "Users can update own papers"
  on public.question_papers for update
  using (auth.uid() = user_id);

create policy "Users can delete own papers"
  on public.question_papers for delete
  using (auth.uid() = user_id);

-- Keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger question_papers_set_updated_at
  before update on public.question_papers
  for each row execute procedure public.set_updated_at();
