alter table episodes
  add column external_link_url text,
  add column external_link_label text default 'Watch on YouTube';