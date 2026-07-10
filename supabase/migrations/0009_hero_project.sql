-- Adds a dedicated "Hero spotlight" flag to projects, separate from is_featured.
-- Only one project can be the Hero at a time (enforced by the partial unique index below),
-- so the Hero can show a different project than the Featured Work grid.

alter table projects
  add column if not exists is_hero boolean not null default false;

-- Guarantees at most one row has is_hero = true, no matter which code path writes it.
create unique index if not exists projects_single_hero_idx
  on projects (is_hero)
  where is_hero = true;

-- Atomic "make this the hero" operation: unsets any current hero, sets the new one,
-- in a single transaction (function bodies run atomically in Postgres).
create or replace function set_hero_project(target_id uuid)
returns void
language sql
as $$
  update projects set is_hero = false where is_hero = true and id <> target_id;
  update projects set is_hero = true where id = target_id;
$$;

-- To clear the hero entirely (fall back to Content 2.0 static hero fields):
-- update projects set is_hero = false where is_hero = true;