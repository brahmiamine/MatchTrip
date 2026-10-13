-- Public catalogue metadata is owner-managed; personal preferences require a session.
ALTER TABLE public.matchtrip_club_media ADD COLUMN IF NOT EXISTS ticket_url text;
ALTER TABLE public.matchtrip_club_media ADD COLUMN IF NOT EXISTS ticket_source_url text;
ALTER TABLE public.matchtrip_club_media ADD COLUMN IF NOT EXISTS ticket_checked_at timestamptz;
ALTER TABLE public.matchtrip_club_media ADD COLUMN IF NOT EXISTS stadium_image_page_url text;
ALTER TABLE public.matchtrip_club_media ADD COLUMN IF NOT EXISTS stadium_image_license text;
ALTER TABLE public.matchtrip_club_media ADD COLUMN IF NOT EXISTS stadium_image_author text;
ALTER TABLE public.matchtrip_club_media ADD COLUMN IF NOT EXISTS media_checked_at timestamptz;
CREATE TABLE IF NOT EXISTS public.matchtrip_catalog_config (
 key text PRIMARY KEY,
 value jsonb NOT NULL,
 updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.matchtrip_catalog_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read public MatchTrip configuration" ON public.matchtrip_catalog_config
 FOR SELECT TO anon, authenticated USING (true);
GRANT SELECT ON public.matchtrip_catalog_config TO anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.matchtrip_catalog_config FROM anon, authenticated;

CREATE TABLE IF NOT EXISTS public.matchtrip_preferences (
 user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
 key text NOT NULL CHECK (key IN ('matchtrip-favorites','matchtrip-blocked','matchtrip-theme','matchtrip-display','matchtrip-filters')),
 value jsonb NOT NULL CHECK (octet_length(value::text) <= 65536),
 updated_at timestamptz NOT NULL DEFAULT now(),
 PRIMARY KEY (user_id, key)
);
ALTER TABLE public.matchtrip_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read own MatchTrip preferences" ON public.matchtrip_preferences
 FOR SELECT TO authenticated USING ((select auth.uid()) = user_id);
CREATE POLICY "Insert own MatchTrip preferences" ON public.matchtrip_preferences
 FOR INSERT TO authenticated WITH CHECK ((select auth.uid()) = user_id);
CREATE POLICY "Update own MatchTrip preferences" ON public.matchtrip_preferences
 FOR UPDATE TO authenticated USING ((select auth.uid()) = user_id) WITH CHECK ((select auth.uid()) = user_id);
CREATE POLICY "Delete own MatchTrip preferences" ON public.matchtrip_preferences
 FOR DELETE TO authenticated USING ((select auth.uid()) = user_id);
REVOKE ALL ON public.matchtrip_preferences FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.matchtrip_preferences TO authenticated;

ALTER TABLE public.matchtrip_club_media ADD COLUMN IF NOT EXISTS ticket_kind text NOT NULL DEFAULT 'shop' CHECK(ticket_kind IN ('shop','information'));
ALTER TABLE public.matchtrip_fixtures ADD COLUMN IF NOT EXISTS venue_override text;
ALTER TABLE public.matchtrip_fixtures ADD COLUMN IF NOT EXISTS venue_source_url text;
ALTER TABLE public.matchtrip_fixtures ADD COLUMN IF NOT EXISTS venue_confirmed boolean NOT NULL DEFAULT false;
