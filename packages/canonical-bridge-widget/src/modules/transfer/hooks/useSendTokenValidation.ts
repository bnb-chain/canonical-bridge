/* eslint-disable no-console */
import axios from 'axios';
import { type PublicClient } from 'viem';

import {
  CBRIDGE_ENDPOINT,
  DEBRIDGE_ENDPOINT,
  MESON_ENDPOINT,
  STARGATE_ENDPOINT,
} from '@/core/constants';
import { IDeBridgeToken, IStargateTokenList } from '@/modules/aggregator';
import { IMesonTokenList } from '@/modules/aggregator/adapters/meson/types';
import { stargateChainKey } from '@/modules/aggregator/adapters/stargate/const';
import { isEvmAddress, isTronAddress } from '@/core/utils/address';
import { CAKE_PROXY_OFT_ABI } from '@/modules/aggregator/adapters/layerZero/abi/cakeProxyOFT';
import { useBridgeSDK } from '@/core/hooks/useBridgeSDK';

interface ICBridgeTokenValidateParams {
  isPegged: boolean;
  fromChainId?: number;
  fromTokenAddress: `0x${string}`;
  fromTokenSymbol: string;
  bridgeAddress: `0x${string}`;
  toChainId?: number;
  toTokenAddress?: `0x${string}`;
  toTokenSymbol?: string;
  amount: number;
  decimals: number;
}

// deBridge only needs to check token address
interface IDeBridgeTokenValidateParams {
  tokenAddress: `0x${string}`;
  fromTokenSymbol: string;
  fromChainId?: number;
  fromTokenAddress: `0x${string}`;
  toTokenSymbol?: string;
  toChainId?: number;
  toTokenAddress: `0x${string}`;
  amount: number;
  decimals: number;
}

interface IStargateTokenValidateParams {
  bridgeAddress: `0x${string}`;
  fromTokenAddress: `0x${string}`;
  fromTokenSymbol: string;
  fromChainId?: number;
  toTokenAddress: `0x${string}`;
  toTokenSymbol: string;
  toChainId?: number;
  amount: number;
}

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
  const bridgeSDK = useBridgeSDK();

  // cBridge
  const validateCBridgeToken = async ({
    isPegged,
    fromChainId,
    fromTokenAddress,
    fromTokenSymbol,
    bridgeAddress,
    toChainId,
    toTokenAddress,
    toTokenSymbol,
    amount,
    decimals,
  }: ICBridgeTokenValidateParams) => {
    await bridgeSDK.cBridge.validateCBridgeToken({
      isPegged,
      fromChainId,
      fromTokenAddress,
      fromTokenSymbol,
      bridgeAddress,
      toChainId,
      toTokenAddress,
      toTokenSymbol,
      amount,
      decimals,
      cBridgeEndpoint: `${CBRIDGE_ENDPOINT}/getTransferConfigsForAll`,
    });
  };

  // deBridge
  const validateDeBridgeToken = async ({
    fromChainId,
    toChainId,
    fromTokenSymbol,
    toTokenSymbol,
    fromTokenAddress,
    toTokenAddress,
    amount,
    decimals,
  }: IDeBridgeTokenValidateParams) => {
    try {
      if (
        !fromChainId ||
        !fromTokenAddress ||
        !toTokenAddress ||
        !fromTokenSymbol ||
        !toTokenSymbol ||
        !toChainId
      ) {
        return false;
      }
      if (!isEvmAddress(toTokenAddress) || !isEvmAddress(toTokenAddress)) return false;
      const fromRequest = axios.get<{
        tokens: { [key: string]: IDeBridgeToken };
      }>(`${DEBRIDGE_ENDPOINT}/token-list?chainId=${fromChainId}`);
      const toRequest = axios.get<{
        tokens: { [key: string]: IDeBridgeToken };
      }>(`${DEBRIDGE_ENDPOINT}/token-list?chainId=${toChainId}`);
      const [fromTokenList, toTokenList] = await Promise.allSettled([fromRequest, toRequest]);
      console.log('fromTokenList', fromTokenList);
      console.log('toTokenList', toTokenList);
      if (fromTokenList.status === 'fulfilled' && toTokenList.status === 'fulfilled') {
        const fromToken = fromTokenList?.value?.data.tokens[fromTokenAddress.toLowerCase()];
        const toToken = toTokenList?.value?.data.tokens[toTokenAddress.toLowerCase()];
        if (
          !!fromToken &&
          fromToken?.address.toLowerCase() === fromTokenAddress.toLowerCase() &&
          fromToken?.symbol === fromTokenSymbol &&
          !!toToken &&
          toToken?.address.toLowerCase() === toTokenAddress.toLowerCase() &&
          toToken?.symbol === toTokenSymbol
        ) {
          console.log('deBridge token info matched', fromToken);
          return true;
        }
      }
      console.log('Could not find deBridge token info');
      console.log('-- fromChainId', fromChainId);
      console.log('-- from tokenSymbol', fromTokenSymbol);
      console.log('-- from tokenAddress', fromTokenAddress);
      console.log('-- toChainId', toChainId);
      console.log('-- to tokenSymbol', toTokenSymbol);
      console.log('-- to tokenAddress', toTokenAddress);
      return false;
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log('deBridge token validation error', error);
      return false;
    }
  };

  // Stargate
  const validateStargateToken = async ({
    bridgeAddress,
    fromTokenAddress,
    fromTokenSymbol,
    fromChainId,
    toTokenAddress,
    toTokenSymbol,
    toChainId,
    amount,
  }: IStargateTokenValidateParams) => {
    try {
      // Check params exist
      if (
        !fromChainId ||
        !fromTokenAddress ||
        !bridgeAddress ||
        !fromTokenSymbol ||
        !toTokenAddress ||
        !toTokenSymbol ||
        !toChainId ||
        !amount
      ) {
        console.log('Missing Stargate params');
        console.log('-- fromChainId', fromChainId);
        console.log('-- fromTokenAddress', fromTokenAddress);
        console.log('-- fromTokenSymbol', fromTokenSymbol);
        console.log('-- toChainId', toChainId);
        console.log('-- toTokenAddress', toTokenAddress);
        console.log('-- toTokenSymbol', toTokenSymbol);
        console.log('-- bridgeAddress', bridgeAddress);
        console.log('-- amount', amount);
        return false;
      }
      // Check evm address
      if (
        !isEvmAddress(fromTokenAddress) ||
        !isEvmAddress(bridgeAddress) ||
        !isEvmAddress(toTokenAddress)
      ) {
        console.log(
          'Invalid Stargate Evm Address',
          fromTokenAddress,
          bridgeAddress,
          toTokenAddress,
        );
        return false;
      }
      const { data: stargateConfig } = await axios.get<{ data: IStargateTokenList }>(
        `${STARGATE_ENDPOINT}`,
      );

      // Get chain name by chain id
      const fromChainKey = stargateChainKey[fromChainId] ?? '';
      const toChainKey = stargateChainKey[toChainId] ?? '';

      if (!fromChainKey || !toChainKey) {
        console.log('Failed to get chain key');
        console.log('From chain key', fromChainKey, fromChainId);
        console.log('To chain key', toChainKey, toChainId);
        return false;
      }
      if (!stargateConfig) {
        console.log('Failed to get Stargate API config');
        return false;
      }
      const fromTokenInfo = stargateConfig.data?.v2?.filter((token) => {
        return (
          token.chainKey === fromChainKey &&
          token.address.toLowerCase() === bridgeAddress.toLowerCase() &&
          token.token.symbol === fromTokenSymbol &&
          token.token.address.toLowerCase() === fromTokenAddress.toLowerCase()
        );
      });

      const toTokenInfo = stargateConfig.data?.v2?.filter((token) => {
        return (
          token.chainKey === fromChainKey &&
          token.address.toLowerCase() === bridgeAddress.toLowerCase() &&
          token.token.symbol === fromTokenSymbol &&
          token.token.address.toLowerCase() === fromTokenAddress.toLowerCase()
        );
      });

      if (!!fromTokenInfo && fromTokenInfo.length > 0 && !!toTokenInfo && toTokenInfo.length > 0) {
        console.log('Stargate token info matched');
        console.log('fromTokenInfo', fromTokenInfo);
        console.log('toTokenInfo', toTokenInfo);
        return true;
      }
      console.log('Could not find Stargate token info');
      console.log('-- fromChainId', fromChainId);
      console.log('-- fromTokenAddress', fromTokenAddress);
      console.log('-- fromTokenSymbol', fromTokenSymbol);
      console.log('-- toChainId', toChainId);
      console.log('-- toTokenAddress', toTokenAddress);
      console.log('-- toTokenSymbol', toTokenSymbol);
      console.log('-- bridgeAddress', bridgeAddress);
      return false;
    } catch (error: any) {
      console.log('Stargate token validation error', error);
      return false;
    }
  };

  // layerZero
  const validateLayerZeroToken = async ({
    publicClient,
    bridgeAddress,
    fromTokenAddress,
    toTokenAddress,
    dstEndpoint,
  }: {
    publicClient: PublicClient;
    bridgeAddress: `0x${string}`;
    fromTokenAddress: `0x${string}`;
    toTokenAddress: `0x${string}`;
    dstEndpoint?: number;
  }) => {
    if (!publicClient || !bridgeAddress || !fromTokenAddress || !dstEndpoint || !toTokenAddress) {
      return false;
    }
    const supportedToken = await publicClient.readContract({
      address: bridgeAddress as `0x${string}`,
      abi: CAKE_PROXY_OFT_ABI,
      functionName: 'token',
    });

    console.log('LayerZero supportedToken', supportedToken);
    console.log('fromToken', fromTokenAddress);
    if (supportedToken.toLowerCase() === fromTokenAddress.toLowerCase()) {
      return true;
    }
    return false;
  };

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
        !toChainId ||
        !toTokenAddress ||
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
    validateCBridgeToken,
    validateDeBridgeToken,
    validateStargateToken,
    validateMesonToken,
    validateLayerZeroToken,
  };
};
