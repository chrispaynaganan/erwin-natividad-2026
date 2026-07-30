-- Adds an optional YouTube video reference to projects, for the
-- "view video" button on /work/[slug]. Stores just the video ID
-- (e.g. "dQw4w9WgXcQ"), not a full URL, to keep it embed-ready.

alter table projects
  add column if not exists video_id text;

comment on column projects.video_id is
  'YouTube video ID only (not full URL) for the project detail video button. Nullable — not every project has one.';
