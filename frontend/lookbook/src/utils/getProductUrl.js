export function getProductUrl(product) {
  if (product?.onlineStoreUrl) return product.onlineStoreUrl;
  if (product?.handle) return `/products/${product.handle}`;
  return '#';
}
