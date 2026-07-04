import { useEffect, useState } from 'react';
import { fetchProductsByHandles } from '../api/fetchProductsByHandles';
import { richTextToPlain } from '../utils/richTextToPlain';
import { ProductCard } from './ProductCard';

function getDescription(lookbook) {
  if (lookbook.descriptionHtml) return { html: lookbook.descriptionHtml };
  if (typeof lookbook.description === 'string' && lookbook.description) {
    return { text: lookbook.description };
  }
  if (lookbook.description && typeof lookbook.description === 'object') {
    const text = richTextToPlain(lookbook.description);
    return text ? { text } : null;
  }
  return null;
}

export function Lookbook({ lookbook, credentials, config }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    country,
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

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchProductsByHandles({
          shopDomain: credentials.shopDomain,
          token: credentials.storefrontAccessToken,
          country,
          handles: lookbook.productHandles ?? [],
        });

        if (!cancelled) setProducts(data);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [lookbook, credentials, country]);

  if (loading) return <p className="lookbook__status">Loading...</p>;
  if (error) return <p className="lookbook__status lookbook__status--error">{error}</p>;

  const description = getDescription(lookbook);

  return (
    <section className="lookbook">
      {lookbook.title && <h2 className="lookbook__title h1"><strong>{lookbook.title}</strong></h2>}
      {description?.html && (
        <div
          className="lookbook__description rte"
          dangerouslySetInnerHTML={{ __html: description.html }}
        />
      )}
      {description?.text && (
        <p className="lookbook__description">{description.text}</p>
      )}

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
    </section>
  );
}
