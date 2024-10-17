import axios, { AxiosInstance } from 'axios';
import {
  IGetMesonEstimateFeeInput,
  IMesonEncodeSwapInput,
  IMesonSendTokenInput,
} from '@/meson/types';
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
      const { data: priceResponse } = await this.client!.post('/price', {
        from: fromToken,
        to: toToken,
        amount: amount,
        fromAddress: fromAddr,
        fromContract: false,
      });
      return priceResponse;
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

  async sendToken({
    fromAddress,
    recipient,
    signature,
    encodedData,
  }: IMesonSendTokenInput) {
    try {
      const { data: swapResponse } = await this.client!.post(
        `/swap/${encodedData}`,
        {
          fromAddress: fromAddress,
          recipient: recipient,
          signature: signature,
        }
      );
      return swapResponse;
    } catch (error: any) {
      // eslint-disable-next-line no-console
      if (error?.response.data) {
        console.log('Meson send token error', error?.response.data);
        return error?.response?.data;
      } else {
        throw new Error(`Failed to send transaction ${error}`);
      }
    }
  }

  async getUnsignedMessage({
    fromToken,
    toToken,
    amount,
    fromAddress,
    recipient,
  }: IMesonEncodeSwapInput) {
    try {
      const { data: swapResponse } = await this.client!.post('/swap', {
        from: fromToken,
        to: toToken,
        amount: amount,
        fromAddress: fromAddress,
        recipient: recipient,
        dataToContract: '',
      });
      return swapResponse;
    } catch (error: any) {
      // eslint-disable-next-line no-console
      if (error?.response.data) {
        console.log('Meson get unsigned message error', error?.response.data);
        return error?.response?.data;
      } else {
        throw new Error(`Failed to get unsigned message ${error}`);
      }
    }
  }
}
