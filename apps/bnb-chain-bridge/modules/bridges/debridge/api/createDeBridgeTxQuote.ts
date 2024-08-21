import { bridgeSDK } from '@/core/constants/bridgeSDK';
// TODO: Remove any
export const createDeBridgeTxQuote = async (urlParams: any) => {
  try {
    return await bridgeSDK.deBridge.createTxQuote(urlParams.toString());
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error creating DeBridge transaction quote', error);
  }
};
