import { useEffect, useState } from 'react';
import { fetchProductsByHandles } from '../api/fetchProductsByHandles';
import { LookbookProductGrid } from './LookbookProductGrid';

export function Lookbook({ lookbook, credentials, config }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { country } = config;

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

  return <LookbookProductGrid products={products} config={config} />;

}