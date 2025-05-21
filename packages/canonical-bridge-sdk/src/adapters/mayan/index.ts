import { IMayanQuotaInput } from '@/adapters/mayan/types';
import { ChainName, fetchQuote } from '@mayanfinance/swap-sdk';

export class Mayan {
  async getEstimatedFees(options: IMayanQuotaInput) {
    try {
      return fetchQuote({
        ...options,
        fromChain: options.fromChain as ChainName,
        toChain: options.toChain as ChainName
      }, { wormhole: true, mctp: false, swift: false });
    } catch (error: any) {
      // eslint-disable-next-line no-console
      if (error?.response.data) {
        console.log('Mayan fee error', error?.response.data);
        return error?.response?.data;
      } else {
        throw new Error(`Failed to get Mayan fees ${error}`);
      }
    }
  }
}