/* eslint-disable no-console */
import axios from 'axios';

import { MESON_ENDPOINT } from '@/core/constants';
import { IMesonTokenList } from '@/modules/aggregator/adapters/meson/types';
import { isEvmAddress, isTronAddress } from '@/core/utils/address';

interface IMesonTokenValidateParams {
  fromChainId?: number;
  toChainId?: number;
  fromTokenSymbol: string;
  fromTokenAddress: `0x${string}`;
  fromChainType?: string;
  toTokenAddress: `0x${string}`;
  toChainType?: string;
  toTokenSymbol?: string;
}

export const useValidateSendToken = () => {
  // Meson
  const validateMesonToken = async ({
    fromChainId,
    fromChainType,
    fromTokenSymbol,
    fromTokenAddress,
    toTokenAddress,
    toChainId,
    toChainType,
    toTokenSymbol,
  }: IMesonTokenValidateParams) => {
    try {
      if (
        !fromChainId ||
        !fromTokenAddress ||
        !fromTokenSymbol ||
        !fromChainType ||
        !toChainId ||
        !toTokenAddress ||
        !toChainType ||
        !toTokenSymbol
      ) {
        return false;
      }
      // from token address
      if (fromChainType === 'evm') {
        if (!isEvmAddress(fromTokenAddress)) return false;
      } else if (fromChainType === 'tron') {
        if (!isTronAddress(fromTokenAddress)) return false;
      }
      // to token address
      if (toChainType === 'evm') {
        if (!isEvmAddress(toTokenAddress)) return false;
      } else if (toChainType === 'tron') {
        if (!isTronAddress(toTokenAddress)) return false;
      }
      const { data: mesonConfig } = await axios.get<{ result: IMesonTokenList[] }>(
        `${MESON_ENDPOINT}/limits`,
      );

      const fromHexNum = fromChainId?.toString(16);
      const toHexNum = toChainId?.toString(16);
      const chainInfo = mesonConfig.result.filter((chainInfo) => {
        const fromTokenInfo = chainInfo.tokens.filter(
          (token) =>
            (token?.addr?.toLowerCase() === fromTokenAddress.toLowerCase() &&
              token.id === fromTokenSymbol.toLowerCase()) ||
            (!token?.addr &&
              fromTokenAddress === '0x0000000000000000000000000000000000000000' &&
              token.id === fromTokenSymbol.toLowerCase()),
        );
        const toTokenInfo = chainInfo.tokens.filter(
          (token) =>
            (token?.addr?.toLowerCase() === toTokenAddress.toLowerCase() &&
              token.id === toTokenSymbol.toLowerCase()) ||
            (!token?.addr &&
              fromTokenAddress === '0x0000000000000000000000000000000000000000' &&
              token.id === toTokenSymbol.toLowerCase()),
        );
        if (!!fromTokenInfo && fromTokenInfo.length > 0) {
          console.log('Meson from token info', fromTokenInfo);
        }
        if (!!toTokenInfo && toTokenInfo.length > 0) {
          console.log('Meson to token info', toTokenInfo);
        }
        const isFromTokenValid =
          chainInfo.chainId === `0x${fromHexNum}` && fromTokenInfo?.length > 0 && !!fromTokenInfo;

        return isFromTokenValid;
      });
      if (!!chainInfo && chainInfo.length > 0) {
        console.log('Meson chain info matched', chainInfo);
        return true;
      }
      console.log('Could not find Meson token');
      console.log('-- fromChainId', fromChainId);
      console.log('-- from tokenAddress', fromTokenAddress);
      console.log('-- from tokenSymbol', fromTokenSymbol);
      console.log('-- to tokenSymbol', toTokenSymbol);
      return false;
    } catch (error: any) {
      console.log('Meson token validation error', error);
      return false;
    }
  };

  return {
    validateMesonToken,
  };
};
