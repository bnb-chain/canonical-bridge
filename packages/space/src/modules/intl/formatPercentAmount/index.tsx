import { getPercentAmountFormatter } from '../getPercentAmountFormatter';

export const formatPercentAmount = ({ locale, amount }: { locale: string; amount: number }) => {
  return getPercentAmountFormatter({ locale }).format(amount);
};
