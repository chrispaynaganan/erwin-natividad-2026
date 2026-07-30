-- 0014_calendly_url_setting.sql
--
-- Adds the Discovery Call event URL as an editable site setting, so Erwin
-- can change it from /admin/settings (Defaults tab) instead of needing a
-- code change + redeploy to update NEXT_PUBLIC_CALENDLY_URL.
--
-- is_public: true — the public /work-with-me page reads this directly via
-- the anon client to render the Calendly embed, same as how other public
-- settings (site_name, booking_provider) already work.

insert into public.settings (key, value, is_public)
values ('calendly_url', '""'::jsonb, true)
on conflict (key) do nothing;