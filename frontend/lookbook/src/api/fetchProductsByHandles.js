import { storefrontQuery } from './storefrontClient';

const PRODUCT_FIELDS = `
  handle
  title
  onlineStoreUrl
  availableForSale
  vendor
  featuredImage {
    url(transform: { maxWidth: 1066 })
    altText
    width
    height
  }
  images(first: 2) {
    nodes {
      url(transform: { maxWidth: 1066 })
      altText
      width
      height
    }
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
`;

function buildProductsByHandlesQuery(handles) {
  const productSelections = handles
    .map(
      (handle, index) =>
        `p${index}: product(handle: ${JSON.stringify(handle)}) { ${PRODUCT_FIELDS} }`
    )
    .join('\n');

  return `
    query ProductsByHandles($country: CountryCode) @inContext(country: $country) {
      ${productSelections}
    }
  `;
}

function normalizeHandles(handles) {
  return [...new Set(handles.filter(Boolean).map((handle) => String(handle).trim()))];
}

export async function fetchProductsByHandles({ shopDomain, token, country, handles }) {
  const uniqueHandles = normalizeHandles(handles);
  if (uniqueHandles.length === 0) return [];

  const data = await storefrontQuery({
    shopDomain,
    token,
    query: buildProductsByHandlesQuery(uniqueHandles),
    variables: { country },
  });

  return uniqueHandles
    .map((_, index) => data[`p${index}`])
    .filter(Boolean);
}
