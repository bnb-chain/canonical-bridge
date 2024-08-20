import { getCryptoAmountFormatter } from '../getCryptoAmountFormatter';

export const formatCryptoAmount = ({
  locale,
  amount,
  symbol,
}: {
  locale: string;
  amount: number;
  symbol: string;
}) => {
  return getCryptoAmountFormatter({ locale, symbol }).format(amount);
};
