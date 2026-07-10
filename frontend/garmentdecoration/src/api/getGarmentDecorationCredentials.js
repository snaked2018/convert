export function getGarmentDecorationCredentials() {
  const el = document.getElementById('garmentdecoration-credentials');
  let storefrontAccessToken;
  let shopDomain;

  if (el?.textContent) {
    ({ storefrontAccessToken, shopDomain } = JSON.parse(el.textContent));
  } else if (import.meta.env.VITE_STOREFRONT_ACCESS_TOKEN) {
    storefrontAccessToken = import.meta.env.VITE_STOREFRONT_ACCESS_TOKEN;
    shopDomain = import.meta.env.VITE_SHOP_DOMAIN;
  }

  if (!storefrontAccessToken) {
    console.warn('[GarmentDecoration] missing #garmentdecoration-credentials');
    return null;
  }

  return { storefrontAccessToken, shopDomain };
}
