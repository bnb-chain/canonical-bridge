export const getFiatAmountFormatter = ({
  locale,
  currency,
}: {
  locale: string;
  currency: string;
}) => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    currencyDisplay: 'narrowSymbol',
  });
};
