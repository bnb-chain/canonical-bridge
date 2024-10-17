import axios, { AxiosInstance } from 'axios';
import { IGetMesonEstimateFeeInput } from '@/meson/types';
import { BaseBridgeConfig } from '@/core';

export class Meson {
  private client?: AxiosInstance;

  constructor(config: BaseBridgeConfig) {
    const { timeout, endpoint } = config;

    this.client = axios.create({
      timeout,
      baseURL: endpoint,
    });
  }

  async getEstimatedFees({
    fromToken,
    toToken,
    amount,
    fromAddr,
  }: IGetMesonEstimateFeeInput) {
    try {
      const { data: swapResponse } = await this.client!.post('/price', {
        from: fromToken,
        to: toToken,
        amount: amount,
        fromAddress: fromAddr,
        fromContract: false,
      });
      return swapResponse;
    } catch (error: any) {
      // eslint-disable-next-line no-console
      if (error?.response.data) {
        console.log('Meson fee error', error?.response.data);
        return error?.response?.data;
      } else {
        throw new Error(`Failed to get Meson fees ${error}`);
      }
    }
  }
}
