export function getLookbookCredentials() {
    console.log('[Lookbook] getLookbookCredentials: start');


    const el = document.getElementById('lookbook-credentials');
    if (!el) {
        throw new Error('Lookbook: missing #lookbook-credentials in theme.liquid');
    }

    const { storefrontAccessToken } = JSON.parse(el.textContent);

    if (!storefrontAccessToken) {
        throw new Error('Lookbook: storefront access token is empty');
    }

    return {
        shopDomain: window.Shopify?.shop ?? window.location.hostname,
        storefrontAccessToken,
    };
}