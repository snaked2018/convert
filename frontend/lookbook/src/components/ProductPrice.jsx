import { formatMoney } from '../utils/formatMoney';

export function ProductPrice({ price, compareAtPrice, availableForSale = true }) {
  if (!price) return null;

  const onSale =
    compareAtPrice &&
    Number(compareAtPrice.amount) > 0 &&
    Number(compareAtPrice.amount) > Number(price.amount);

  const regular = formatMoney(price.amount, price.currencyCode);
  const compare = compareAtPrice
    ? formatMoney(compareAtPrice.amount, compareAtPrice.currencyCode)
    : null;

  return (
    <div
      className={[
        'price',
        !availableForSale ? 'price--sold-out' : '',
        onSale ? 'price--on-sale' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="price__container">
        <div className="price__regular">
          <span className="visually-hidden">Regular price</span>
          <span className="price-item price-item--regular">{regular}</span>
        </div>
        {onSale && (
          <div className="price__sale">
            <span className="visually-hidden">Regular price</span>
            <span>
              <s className="price-item price-item--regular">{compare}</s>
            </span>
            <span className="visually-hidden">Sale price</span>
            <span className="price-item price-item--sale price-item--last">{regular}</span>
          </div>
        )}
      </div>
    </div>
  );
}
