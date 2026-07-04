import { ProductPrice } from './ProductPrice';

export function ProductCard({ product }) {
  if (!product) return null;

  return (
    <a href={product.onlineStoreUrl} className="lookbook-product">
      {product.featuredImage && (
        <img
          src={product.featuredImage.url}
          alt={product.featuredImage.altText || product.title}
          loading="lazy"
          width="600"
          height="800"
        />
      )}
      <h3 className="lookbook-product__title">{product.title}</h3>
      <ProductPrice
        price={product.priceRange?.minVariantPrice}
        compareAtPrice={product.compareAtPriceRange?.minVariantPrice}
      />
    </a>
  );
}