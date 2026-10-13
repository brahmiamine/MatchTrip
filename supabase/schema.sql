-- MatchTrip only: never modify the existing referee app public.matches table.
-- MatchTrip: catalogue public en lecture seule. L'écriture reste réservée au propriétaire de la base.
CREATE TABLE IF NOT EXISTS public.matchtrip_fixtures (
 fixture_key text PRIMARY KEY,
 country text NOT NULL,
 zone text NOT NULL,
 cluster text NOT NULL DEFAULT '',
 city text NOT NULL DEFAULT '',
 league text NOT NULL,
 home text NOT NULL,
 away text NOT NULL,
 date date NOT NULL,
 time time WITHOUT TIME ZONE,
 provisional boolean NOT NULL DEFAULT false,
 highlight boolean NOT NULL DEFAULT false,
 source_url text,
 date_window_start date,
 date_window_end date,
 created_at timestamptz NOT NULL DEFAULT now(),
 updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS matchtrip_fixtures_date_idx ON public.matchtrip_fixtures(date);
CREATE INDEX IF NOT EXISTS matchtrip_fixtures_country_zone_date_idx ON public.matchtrip_fixtures(country,zone,date);
ALTER TABLE public.matchtrip_fixtures ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read football fixtures" ON public.matchtrip_fixtures;
CREATE POLICY "Public can read football fixtures" ON public.matchtrip_fixtures FOR SELECT TO anon, authenticated USING (true);
GRANT SELECT ON public.matchtrip_fixtures TO anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.matchtrip_fixtures FROM anon, authenticated;
