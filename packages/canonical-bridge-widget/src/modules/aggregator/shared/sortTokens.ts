import { IBridgeTokenWithBalance } from '@bnb-chain/canonical-bridge-sdk';

export function sortTokens({ tokens = [] }: { tokens?: IBridgeTokenWithBalance[] }) {
  const sortedTokens = [...tokens].sort((a, b) => {
    if (a.isCompatible && b.isCompatible) {
      if (a.value && b.value) {
        return b.value - a.value;
      }
      if (a.value && !b.value) {
        return -1;
      }
      if (!a.value && b.value) {
        return 1;
      }

      const aBalance = Number(a.balance);
      const bBalance = Number(b.balance);
      if (aBalance && bBalance) {
        return 0;
      }
      if (aBalance && !bBalance) {
        return -1;
      }
      if (!aBalance && bBalance) {
        return 1;
      }
    }

    return 0;
  });

  return sortedTokens;
}
