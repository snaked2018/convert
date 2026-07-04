import { ProductCard } from './ProductCard';

export function LookbookProductGrid({ products, config }) {
  const {
    sectionId,
    columnsDesktop = 4,
    columnsMobile = '2',
    imageRatio = 'portrait',
    showSecondaryImage = false,
    showVendor = false,
    cardStyle = 'standard',
    cardColorScheme = 'background-1',
    badgePosition = 'bottom left',
    soldOutBadgeColorScheme = 'inverse',
    saleBadgeColorScheme = 'accent-2',
  } = config;

  return (
    <ul
      className={`grid product-grid contains-card contains-card--product contains-card--${cardStyle} grid--${columnsDesktop}-col-desktop grid--${columnsMobile}-col-tablet-down`}
      role="list"
    >
      {products.map((product) => (
        <ProductCard
          key={product.handle}
          product={product}
          sectionId={sectionId}
          imageRatio={imageRatio}
          showSecondaryImage={showSecondaryImage}
          showVendor={showVendor}
          cardStyle={cardStyle}
          cardColorScheme={cardColorScheme}
          badgePosition={badgePosition}
          soldOutBadgeColorScheme={soldOutBadgeColorScheme}
          saleBadgeColorScheme={saleBadgeColorScheme}
        />
      ))}
    </ul>
  );
}
