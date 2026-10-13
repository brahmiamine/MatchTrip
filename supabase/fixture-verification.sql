alter table public.matchtrip_fixtures add column if not exists date_confirmed boolean not null default false;
alter table public.matchtrip_fixtures add column if not exists time_confirmed boolean not null default false;
alter table public.matchtrip_fixtures add column if not exists verified_source_url text;
alter table public.matchtrip_fixtures add column if not exists verified_at timestamptz;
comment on column public.matchtrip_fixtures.date_confirmed is 'Vrai uniquement si date appariée à une publication officielle par rencontre.';
comment on column public.matchtrip_fixtures.time_confirmed is 'Vrai uniquement si heure de début officiellement vérifiée, pas simplement renseignée.';
comment on column public.matchtrip_fixtures.verified_source_url is 'URL officielle documentant date et/ou heure pour cette rencontre.';
