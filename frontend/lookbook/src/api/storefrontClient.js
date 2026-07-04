const API_VERSION = '2026-10';

export async function storefrontQuery({ shopDomain, token, query, variables }) {
  const response = await fetch(
    `https://${shopDomain}/api/${API_VERSION}/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': token,
      },
      body: JSON.stringify({ query, variables }),
    }
  );

  const json = await response.json();

  // console.log('[Lookbook] storefrontQuery: response', {
  //   status: response.status,
  //   ok: response.ok,
  //   hasErrors: Boolean(json.errors?.length),
  //   errors: json.errors,
  //   dataKeys: json.data ? Object.keys(json.data) : null,
  // });

  if (!response.ok || json.errors?.length) {
    throw new Error(json.errors?.map((e) => e.message).join(', ') ?? response.statusText);
  }

  return json.data;
}