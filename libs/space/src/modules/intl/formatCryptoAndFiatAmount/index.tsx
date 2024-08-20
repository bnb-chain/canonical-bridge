import { formatCryptoAmount } from '../formatCryptoAmount';
import { formatFiatAmount } from '../formatFiatAmount';

export const formatCryptoAndFiatAmount = ({
  crypto,
  fiat,
  locale,
}: {
  locale: string;
  crypto: {
    amount: number;
    symbol: string;
  };
  fiat: {
    amount: number;
    currency: string;
  };
}) => {
  return `${formatCryptoAmount({
    locale,
    amount: crypto.amount,
    symbol: crypto.symbol,
  })} (~${formatFiatAmount({
    locale,
    amount: fiat.amount,
    currency: fiat.currency,
  })})`;
};
