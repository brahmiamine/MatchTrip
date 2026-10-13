-- MatchTrip media only; independent of other applications' tables.
CREATE TABLE IF NOT EXISTS public.matchtrip_club_media (
 club text PRIMARY KEY,
 logo_url text,
 club_source_url text,
 stadium text,
 stadium_image_url text,
 stadium_source_url text,
 stadium_official_url text,
 verified_at date NOT NULL
);
ALTER TABLE public.matchtrip_club_media ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read MatchTrip media" ON public.matchtrip_club_media FOR SELECT TO anon, authenticated USING (true);
GRANT SELECT ON public.matchtrip_club_media TO anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.matchtrip_club_media FROM anon, authenticated;
