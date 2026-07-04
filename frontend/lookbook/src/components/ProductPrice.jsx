import { formatMoney } from '../utils/formatMoney';

export function ProductPrice({ price, compareAtPrice }) {
  if (!price) return null;

  const onSale =
    compareAtPrice &&
    Number(compareAtPrice.amount) > 0 &&
    Number(compareAtPrice.amount) > Number(price.amount);

  return (
    <div className="lookbook-product__price">
      <span className="lookbook-product__price-current">
        {formatMoney(price.amount, price.currencyCode)}
      </span>
      {onSale && (
        <s className="lookbook-product__price-compare">
          {formatMoney(compareAtPrice.amount, compareAtPrice.currencyCode)}
        </s>
      )}
    </div>
  );
}