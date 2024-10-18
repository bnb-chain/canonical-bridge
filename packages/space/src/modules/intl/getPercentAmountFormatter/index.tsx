export const getPercentAmountFormatter = ({ locale }: { locale: string }) => {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
