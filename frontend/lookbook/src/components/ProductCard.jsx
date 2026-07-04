import { ProductPrice } from './ProductPrice';
import { getRatioPercent } from '../utils/getRatioPercent';
import { getProductUrl } from '../utils/getProductUrl';

export function ProductCard({
  product,
  sectionId,
  imageRatio = 'portrait',
  showSecondaryImage = false,
  showVendor = false,
  cardStyle = 'standard',
  cardColorScheme = 'background-1',
  badgePosition = 'bottom left',
  soldOutBadgeColorScheme = 'inverse',
  saleBadgeColorScheme = 'accent-2',
}) {
  if (!product) return null;

  const ratioPercent = getRatioPercent(imageRatio, product.featuredImage);
  const secondaryImage = product.images?.nodes?.[1];
  const price = product.priceRange?.minVariantPrice;
  const compareAt = product.compareAtPriceRange?.minVariantPrice;
  const onSale =
    product.availableForSale &&
    compareAt &&
    Number(compareAt.amount) > 0 &&
    Number(compareAt.amount) > Number(price?.amount ?? 0);

  const cardId = `${sectionId}-${product.handle}`;
  const productUrl = getProductUrl(product);

  const badge =
    !product.availableForSale ? (
      <span
        id={`Badge-${cardId}`}
        className={`badge badge--bottom-left color-${soldOutBadgeColorScheme}`}
      >
        Sold out
      </span>
    ) : onSale ? (
      <span
        id={`Badge-${cardId}`}
        className={`badge badge--bottom-left color-${saleBadgeColorScheme}`}
      >
        Sale
      </span>
    ) : null;

  return (
    <li className="grid__item">
      <div className="card-wrapper product-card-wrapper underline-links-hover">
        <div
          className={[
            'card',
            `card--${cardStyle}`,
            product.featuredImage ? 'card--media' : 'card--text',
            cardStyle === 'card' ? `color-${cardColorScheme} gradient` : '',
            'card--extend-height',
          ]
            .filter(Boolean)
            .join(' ')}
          style={{ '--ratio-percent': ratioPercent }}
        >
          <div
            className={[
              'card__inner',
              cardStyle === 'standard' ? `color-${cardColorScheme} gradient` : '',
              product.featuredImage || cardStyle === 'standard' ? 'ratio' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            style={{ '--ratio-percent': ratioPercent }}
          >
            {product.featuredImage && (
              <div className="card__media">
                <div className="media media--transparent media--hover-effect">
                  <img
                    src={product.featuredImage.url}
                    alt={product.featuredImage.altText || product.title}
                    loading="lazy"
                    className="motion-reduce"
                    width={product.featuredImage.width}
                    height={product.featuredImage.height}
                  />
                  {showSecondaryImage && secondaryImage && (
                    <img
                      src={secondaryImage.url}
                      alt=""
                      loading="lazy"
                      className="motion-reduce"
                      width={secondaryImage.width}
                      height={secondaryImage.height}
                    />
                  )}
                </div>
              </div>
            )}

            <div className="card__content">
              <div className="card__information">
                <h3 className="card__heading">
                  <a href={productUrl} className="full-unstyled-link">
                    {product.title}
                  </a>
                </h3>
              </div>
              <div className={`card__badge ${badgePosition}`}>{badge}</div>
            </div>
          </div>

          <div className="card__content">
            <div className="card__information">
              <h3
                className={[
                  'card__heading',
                  product.featuredImage || cardStyle === 'standard' ? 'h5' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                id={`title-${cardId}`}
              >
                <a
                  href={productUrl}
                  id={`CardLink-${cardId}`}
                  className="full-unstyled-link"
                  aria-labelledby={`CardLink-${cardId} Badge-${cardId}`}
                >
                  {product.title}
                </a>
              </h3>
              <div className="card-information">
                {showVendor && product.vendor && (
                  <>
                    <span className="visually-hidden">Vendor</span>
                    <div className="caption-with-letter-spacing light">{product.vendor}</div>
                  </>
                )}
                <ProductPrice
                  price={price}
                  compareAtPrice={compareAt}
                  availableForSale={product.availableForSale}
                />
              </div>
            </div>
            <div className={`card__badge ${badgePosition}`}>{badge}</div>
          </div>
        </div>
      </div>
    </li>
  );
}
