const DEFAULTS = {
  cardStyle: 'standard',
  cardColorScheme: 'background-1',
  badgePosition: 'bottom left',
  soldOutBadgeColorScheme: 'inverse',
  saleBadgeColorScheme: 'accent-2',
};

let cachedThemeConfig;

export function getLookbookThemeConfig() {
  if (cachedThemeConfig) return cachedThemeConfig;

  const el = document.getElementById('lookbook-theme-config');
  if (!el) {
    cachedThemeConfig = DEFAULTS;
    return cachedThemeConfig;
  }

  try {
    cachedThemeConfig = { ...DEFAULTS, ...JSON.parse(el.textContent) };
  } catch {
    cachedThemeConfig = DEFAULTS;
  }

  return cachedThemeConfig;
}

export function mergeLookbookConfig(mountConfig) {
  return { ...getLookbookThemeConfig(), ...mountConfig };
}
