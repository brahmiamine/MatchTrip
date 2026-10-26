-- Schéma MariaDB de MatchTrip. Idempotent : appliqué automatiquement au démarrage de l'API.

-- Comptes et sessions
CREATE TABLE IF NOT EXISTS users (
  id CHAR(36) NOT NULL PRIMARY KEY,
  email VARCHAR(320) NOT NULL,
  password_hash VARCHAR(100) NOT NULL,
  created_at DATETIME(3) NOT NULL DEFAULT UTC_TIMESTAMP(3),
  UNIQUE KEY users_email_unique (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS sessions (
  token_hash CHAR(64) NOT NULL PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  created_at DATETIME(3) NOT NULL DEFAULT UTC_TIMESTAMP(3),
  expires_at DATETIME(3) NOT NULL,
  KEY sessions_user_idx (user_id),
  CONSTRAINT sessions_user_fk FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS email_tokens (
  token_hash CHAR(64) NOT NULL PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  purpose ENUM('recovery', 'magic') NOT NULL,
  expires_at DATETIME(3) NOT NULL,
  KEY email_tokens_user_idx (user_id),
  CONSTRAINT email_tokens_user_fk FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Catalogue public (lecture seule via l'API ; mis à jour par l'administrateur avec seed.sql ou phpMyAdmin).
CREATE TABLE IF NOT EXISTS matchtrip_fixtures (
  fixture_key VARCHAR(255) NOT NULL PRIMARY KEY,
  country VARCHAR(100) NOT NULL,
  zone VARCHAR(150) NOT NULL,
  cluster VARCHAR(150) NOT NULL DEFAULT '',
  city VARCHAR(150) NOT NULL DEFAULT '',
  league VARCHAR(150) NOT NULL,
  home VARCHAR(150) NOT NULL,
  away VARCHAR(150) NOT NULL,
  date DATE NOT NULL,
  time TIME NULL,
  provisional BOOLEAN NOT NULL DEFAULT FALSE,
  highlight BOOLEAN NOT NULL DEFAULT FALSE,
  source_url TEXT NULL,
  date_window_start DATE NULL,
  date_window_end DATE NULL,
  created_at DATETIME(3) NOT NULL DEFAULT UTC_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT UTC_TIMESTAMP(3),
  date_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
  time_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
  verified_source_url TEXT NULL,
  verified_at DATETIME(3) NULL,
  venue_override TEXT NULL,
  venue_source_url TEXT NULL,
  venue_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
  KEY matchtrip_fixtures_date_idx (date),
  KEY matchtrip_fixtures_country_zone_date_idx (country, zone, date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS matchtrip_club_media (
  club VARCHAR(150) NOT NULL PRIMARY KEY,
  logo_url TEXT NULL,
  club_source_url TEXT NULL,
  stadium TEXT NULL,
  stadium_image_url TEXT NULL,
  stadium_source_url TEXT NULL,
  stadium_official_url TEXT NULL,
  verified_at DATE NOT NULL,
  ticket_url TEXT NULL,
  ticket_source_url TEXT NULL,
  ticket_checked_at DATETIME(3) NULL,
  stadium_image_page_url TEXT NULL,
  stadium_image_license TEXT NULL,
  stadium_image_author TEXT NULL,
  media_checked_at DATETIME(3) NULL,
  ticket_kind ENUM('shop', 'information') NOT NULL DEFAULT 'shop'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS matchtrip_catalog_config (
  `key` VARCHAR(100) NOT NULL PRIMARY KEY,
  value LONGTEXT NOT NULL,
  updated_at DATETIME(3) NOT NULL DEFAULT UTC_TIMESTAMP(3),
  CONSTRAINT catalog_config_value_check CHECK (JSON_VALID(value))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Préférences privées (favoris, filtres, thème…) : l'API filtre toujours par user_id.
CREATE TABLE IF NOT EXISTS matchtrip_preferences (
  user_id CHAR(36) NOT NULL,
  `key` ENUM('matchtrip-favorites', 'matchtrip-blocked', 'matchtrip-theme', 'matchtrip-display', 'matchtrip-filters') NOT NULL,
  value LONGTEXT NOT NULL,
  updated_at DATETIME(3) NOT NULL DEFAULT UTC_TIMESTAMP(3),
  PRIMARY KEY (user_id, `key`),
  CONSTRAINT preferences_value_check CHECK (JSON_VALID(value) AND CHAR_LENGTH(value) <= 65536),
  CONSTRAINT preferences_user_fk FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
