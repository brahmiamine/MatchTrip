export let FLAGS = { France: '🇫🇷', Belgique: '🇧🇪', 'Pays-Bas': '🇳🇱', Espagne: '🇪🇸', Italie: '🇮🇹', Allemagne: '🇩🇪' };
/** Ordre d'affichage préféré ; les pays absents de cette liste sont ajoutés à la suite. */
export let COUNTRY_ORDER = ['France', 'Belgique', 'Pays-Bas', 'Espagne', 'Italie', 'Allemagne'];
/** Aucun week-end indisponible par défaut : c'est l'utilisateur qui les ajoute. */
export let EXCLUDED_DEFAULT = [];
export let EVENING_FROM = '18:00';
export let MIN_GAP_MINUTES = 240;
export let PAGE_SIZE = 40;
export let WEEKENDS_PAGE_STEP = 30;
export let MATCHES_PAGE_STEP = 40;

export function configureConstants(config) {
  if (config.FLAGS) FLAGS = config.FLAGS;
  if (config.COUNTRY_ORDER) COUNTRY_ORDER = config.COUNTRY_ORDER;
  if (config.EXCLUDED_DEFAULT) EXCLUDED_DEFAULT = config.EXCLUDED_DEFAULT;
  if (config.EVENING_FROM) EVENING_FROM = config.EVENING_FROM;
  if (config.MIN_GAP_MINUTES !== undefined) MIN_GAP_MINUTES = config.MIN_GAP_MINUTES;
  if (config.PAGE_SIZE) PAGE_SIZE = config.PAGE_SIZE;
  if (config.WEEKENDS_PAGE_STEP) WEEKENDS_PAGE_STEP = config.WEEKENDS_PAGE_STEP;
  if (config.MATCHES_PAGE_STEP) MATCHES_PAGE_STEP = config.MATCHES_PAGE_STEP;
}
