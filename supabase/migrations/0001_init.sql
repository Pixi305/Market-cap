-- Marketcap initial schema: profiles, watchlists, portfolios, holdings

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);

create table public.watchlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null default 'My Watchlist',
  is_default boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.watchlist_items (
  id uuid primary key default gen_random_uuid(),
  watchlist_id uuid not null references public.watchlists(id) on delete cascade,
  symbol text not null,
  added_at timestamptz not null default now(),
  unique (watchlist_id, symbol)
);

create table public.portfolios (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null default 'My Portfolio',
  created_at timestamptz not null default now()
);

create table public.holdings (
  id uuid primary key default gen_random_uuid(),
  portfolio_id uuid not null references public.portfolios(id) on delete cascade,
  symbol text not null,
  quantity numeric(18, 6) not null check (quantity > 0),
  avg_cost numeric(18, 4),
  purchased_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Row Level Security: every table is owner-only

alter table public.profiles enable row level security;
alter table public.watchlists enable row level security;
alter table public.watchlist_items enable row level security;
alter table public.portfolios enable row level security;
alter table public.holdings enable row level security;

create policy "profiles_self" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "watchlists_owner" on public.watchlists
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "watchlist_items_owner" on public.watchlist_items
  for all using (
    exists (
      select 1 from public.watchlists w
      where w.id = watchlist_id and w.user_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from public.watchlists w
      where w.id = watchlist_id and w.user_id = auth.uid()
    )
  );

create policy "portfolios_owner" on public.portfolios
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "holdings_owner" on public.holdings
  for all using (
    exists (
      select 1 from public.portfolios p
      where p.id = portfolio_id and p.user_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from public.portfolios p
      where p.id = portfolio_id and p.user_id = auth.uid()
    )
  );

-- On new auth user: create profile + default watchlist + default portfolio

create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id);
  insert into public.watchlists (user_id) values (new.id);
  insert into public.portfolios (user_id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
