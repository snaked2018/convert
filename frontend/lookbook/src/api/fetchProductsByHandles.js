import { storefrontQuery } from './storefrontClient';

const PRODUCTS_BY_HANDLES = `
  query ProductsByHandles($country: CountryCode, $query: String!) @inContext(country: $country) {
    products(first: 20, query: $query) {
      nodes {
        handle
        title
        onlineStoreUrl
        featuredImage {
          url(transform: { maxWidth: 600 })
          altText
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        compareAtPriceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
      }
    }
  }
`;

// Build handle query
function buildHandleQuery(handles) {
  return [...new Set(handles.filter(Boolean))]
    .map((handle) => `handle:${handle}`)
    .join(' OR ');
}

// Sort products by handle order
function sortByHandleOrder(products, handles) {
  const order = new Map(handles.map((h, i) => [h, i]));
  return [...products].sort(
    (a, b) => (order.get(a.handle) ?? 999) - (order.get(b.handle) ?? 999)
  );
}

// Fetch products by handles
export async function fetchProductsByHandles({ shopDomain, token, country, handles }) {
  const uniqueHandles = [...new Set(handles.filter(Boolean))];
  if (uniqueHandles.length === 0) return [];

  const data = await storefrontQuery({
    shopDomain,
    token,
    query: PRODUCTS_BY_HANDLES,
    variables: {
      country,
      query: buildHandleQuery(uniqueHandles),
    },
  });

  // Return sorted products
  return sortByHandleOrder(data.products?.nodes ?? [], uniqueHandles);
}