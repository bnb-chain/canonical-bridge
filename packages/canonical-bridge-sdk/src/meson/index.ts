import axios, { AxiosInstance } from 'axios';
import {
  IGetMesonEstimateFeeInput,
  IMesonEncodeSwapInput,
  IMesonSendTokenInput,
} from '@/meson/types';
import { BaseBridgeConfig } from '@/core';
import { isEvmAddress, isTronAddress } from '@/core/utils/address';
import {
  IMesonTokenList,
  IMesonTokenValidateParams,
} from '@/meson/types/index';

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

  validateMesonToken = async ({
    fromChainId,
    fromChainType,
    fromTokenSymbol,
    fromTokenAddress,
    fromTokenDecimals,
    toTokenAddress,
    toChainId,
    toChainType,
    toTokenSymbol,
    toTokenDecimals,
    amount,
    mesonEndpoint,
  }: IMesonTokenValidateParams) => {
    try {
      if (
        !fromChainId ||
        !fromTokenAddress ||
        !fromTokenSymbol ||
        !fromTokenDecimals ||
        !fromChainType ||
        !toChainId ||
        !toTokenAddress ||
        !toTokenDecimals ||
        !toChainType ||
        !toTokenSymbol ||
        !amount ||
        !mesonEndpoint
      ) {
        console.log('Missing Meson required params');
        console.log('-- fromChainId', fromChainId);
        console.log('-- fromTokenAddress', fromTokenAddress);
        console.log('-- fromTokenSymbol', fromTokenSymbol);
        console.log('-- fromTokenDecimals', fromTokenDecimals);
        console.log('-- fromChainType', fromChainType);
        console.log('-- toChainId', toChainId);
        console.log('-- toTokenAddress', toTokenAddress);
        console.log('-- toTokenDecimals', toTokenDecimals);
        console.log('-- toChainType', toChainType);
        console.log('-- toTokenSymbol', toTokenSymbol);
        console.log('-- amount', amount);
        console.log('-- mesonEndpoint', mesonEndpoint);
        return false;
      }
      // Check amount
      if (Number(amount) <= 0) {
        console.log('Invalid token amount');
        return false;
      }
      if (fromTokenSymbol.toLowerCase() !== toTokenSymbol.toLowerCase()) {
        console.log('Invalid token symbol', fromTokenSymbol, toTokenSymbol);
        return false;
      }
      // from token address
      if (fromChainType === 'evm') {
        if (!isEvmAddress(fromTokenAddress)) {
          console.log('Invalid from token address', fromTokenAddress);

          return false;
        }
      } else if (fromChainType === 'tron') {
        if (!isTronAddress(fromTokenAddress)) {
          console.log('Invalid from token address', fromTokenAddress);
          return false;
        }
      }
      // to token address
      if (toChainType === 'evm') {
        if (!isEvmAddress(toTokenAddress)) {
          console.log('Invalid to token address', toTokenAddress);
          return false;
        }
      } else if (toChainType === 'tron') {
        if (!isTronAddress(toTokenAddress)) {
          console.log('Invalid to token address', toTokenAddress);
          return false;
        }
      }
      // Check token information from Meson API
      const { data: mesonConfig } = await axios.get<{
        result: IMesonTokenList[];
      }>(`${mesonEndpoint}/limits`);
      const fromHexNum = fromChainId?.toString(16);
      const toHexNum = toChainId?.toString(16);
      // from token validation
      const validFromToken = mesonConfig.result.filter((chainInfo) => {
        const fromTokenInfo = chainInfo.tokens.filter(
          (token) =>
            (token?.addr?.toLowerCase() === fromTokenAddress.toLowerCase() &&
              token.decimals === fromTokenDecimals &&
              token.id === fromTokenSymbol.toLowerCase()) ||
            (!token?.addr &&
              fromTokenAddress ===
                '0x0000000000000000000000000000000000000000' &&
              token.decimals === fromTokenDecimals &&
              token.id === fromTokenSymbol.toLowerCase())
        );
        if (!!fromTokenInfo && fromTokenInfo.length > 0) {
          console.log('Meson from token info', fromTokenInfo);
        }
        return (
          chainInfo.chainId === `0x${fromHexNum}` &&
          fromTokenInfo?.length > 0 &&
          !!fromTokenInfo
        );
      });
      // to token validation
      const validToToken = mesonConfig.result.filter((chainInfo) => {
        const toTokenInfo = chainInfo.tokens.filter(
          (token) =>
            (token?.addr?.toLowerCase() === toTokenAddress.toLowerCase() &&
              token.decimals === toTokenDecimals &&
              token.id === toTokenSymbol.toLowerCase()) ||
            (!token?.addr &&
              toTokenAddress === '0x0000000000000000000000000000000000000000' &&
              token.decimals === toTokenDecimals &&
              token.id === toTokenSymbol.toLowerCase())
        );
        if (!!toTokenInfo && toTokenInfo.length > 0) {
          console.log('Meson to token info', toTokenInfo);
        }
        return (
          chainInfo.chainId === `0x${toHexNum}` &&
          toTokenInfo?.length > 0 &&
          !!toTokenInfo
        );
      });
      if (validToToken?.length > 0 && validFromToken?.length > 0) {
        console.log('Meson token info matched', validToToken, validFromToken);
        return true;
      }
      console.log('Could not find Meson token');
      console.log('-- fromChainId', fromChainId);
      console.log('-- fromTokenAddress', fromTokenAddress);
      console.log('-- fromTokenSymbol', fromTokenSymbol);
      console.log('-- fromChainType', fromChainType);
      console.log('-- toChainId', toChainId);
      console.log('-- toTokenAddress', toTokenAddress);
      console.log('-- toChainType', toChainType);
      console.log('-- toTokenSymbol', toTokenSymbol);
      console.log('-- amount', amount);
      return false;
      // eslint-disable-next-line
    } catch (error: any) {
      console.log('Meson token validation error', error);
      return false;
    }
  };
}
