import { getFiatAmountFormatter } from '../getFiatAmountFormatter';

export const formatFiatAmount = ({
  locale,
  amount,
  currency,
}: {
  locale: string;
  amount: number;
  currency: string;
}) => {
  return getFiatAmountFormatter({ locale, currency }).format(amount);
};
