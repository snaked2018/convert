export function formatMoney(amount, currencyCode) {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currencyCode,
    }).format(Number(amount));
  }