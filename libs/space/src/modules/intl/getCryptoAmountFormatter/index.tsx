import { NON_BREAKING_SPACE } from '../constants';

export const getCryptoAmountFormatter = ({
  locale,
  symbol,
}: {
  locale: string;
  symbol: string;
}) => {
  const formatter = Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 20,
  });

  const format: typeof formatter.format = (number: number) =>
    `${formatter.format(number)}${symbol ? NON_BREAKING_SPACE : ''}${symbol}`;

  const formatToParts: typeof formatter.formatToParts = (number: number) => [
    ...formatter.formatToParts(number),
    { type: 'literal', value: NON_BREAKING_SPACE },
    { type: 'currency', value: symbol },
  ];

  return { format, formatToParts };
};
