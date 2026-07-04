import { useEffect, useState } from 'react';
import { fetchProductsByHandles } from '../api/fetchProductsByHandles';
import { getLookbookDescription } from '../utils/lookbookDescription';
import { LookbookProductGrid } from './LookbookProductGrid';

export function LookbookCarousel({ config, credentials }) {
  const { lookbooks, country, sectionId } = config;
  const [activeIndex, setActiveIndex] = useState(0);
  const [productsByIndex, setProductsByIndex] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const activeLookbook = lookbooks[activeIndex];
  const description = activeLookbook ? getLookbookDescription(activeLookbook) : null;
  const showNav = lookbooks.length > 1;
  const panelId = `lookbook-carousel-${sectionId}`;

  useEffect(() => {
    let cancelled = false;

    async function loadAll() {
      try {
        setLoading(true);
        setError(null);

        const results = await Promise.all(
          lookbooks.map((lookbook) =>
            fetchProductsByHandles({
              shopDomain: credentials.shopDomain,
              token: credentials.storefrontAccessToken,
              country,
              handles: lookbook.productHandles ?? [],
            })
          )
        );

        if (!cancelled) setProductsByIndex(results);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadAll();

    return () => {
      cancelled = true;
    };
  }, [lookbooks, credentials, country]);

  if (loading) return <p className="lookbook__status">Loading...</p>;
  if (error) return <p className="lookbook__status lookbook__status--error">{error}</p>;

  return (
    <section className="lookbook lookbook-carousel" aria-label="Related lookbooks">
      <div className="lookbook-carousel__header title-wrapper title-wrapper--no-top-margin">
        {showNav && (
          <div
            className="lookbook-carousel__tabs"
            role="tablist"
            aria-label="Lookbook selection"
          >
            {lookbooks.map((lookbook, index) => {
              const isActive = index === activeIndex;
              const tabId = `lookbook-tab-${sectionId}-${index}`;

              return (
                <button
                  key={`${lookbook.title}-${index}`}
                  type="button"
                  id={tabId}
                  role="tab"
                  className={`lookbook-carousel__tab${isActive ? ' lookbook-carousel__tab--active' : ''}`}
                  aria-selected={isActive}
                  aria-controls={panelId}
                  onClick={() => setActiveIndex(index)}
                >
                  {lookbook.title}
                </button>
              );
            })}
          </div>
        )}

        {activeLookbook?.title && (
          <h2 className="lookbook__title title h1">{activeLookbook.title}</h2>
        )}

        {description?.html && (
          <div
            className="lookbook__description rte"
            dangerouslySetInnerHTML={{ __html: description.html }}
          />
        )}
        {description?.text && (
          <p className="lookbook__description">{description.text}</p>
        )}
      </div>

      <div
        id={panelId}
        className="lookbook-carousel__panel"
        role="tabpanel"
        aria-labelledby={`lookbook-tab-${sectionId}-${activeIndex}`}
      >
        <LookbookProductGrid
          products={productsByIndex[activeIndex] ?? []}
          config={config}
        />
      </div>
    </section>
  );
}
