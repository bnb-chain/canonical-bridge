import { useTronWeb } from '@/core/hooks/useTronWeb';

export const useTronContract = () => {
  const tronWeb = useTronWeb();

  const isTronContractInfo = async (address: string) => {
    if (!tronWeb) return;
    try {
      const contractInfo = await tronWeb.trx.getContract(address);
      return !!contractInfo?.bytecode;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
      return false;
    }
  };

  return {
    isTronContractInfo,
  };
};
