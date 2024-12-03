/* eslint-disable no-console */
import axios from 'axios';

import {
  CBRIDGE_ENDPOINT,
  DEBRIDGE_ENDPOINT,
  MESON_ENDPOINT,
  STARGATE_ENDPOINT,
} from '@/core/constants';
import { ICBridgeTransferConfig, IDeBridgeToken, IStargateTokenList } from '@/modules/aggregator';
import { IMesonTokenList } from '@/modules/aggregator/adapters/meson/types';
import { stargateChainKey } from '@/modules/aggregator/adapters/stargate/const';

interface ICBridgeTokenValidateParams {
  isPegged: boolean;
  tokenAddress: `0x${string}`;
  bridgeAddress: `0x${string}`;
  fromChainId?: number;
  toChainId?: number;
  tokenSymbol: string;
}

// deBridge only needs to check token address
interface IDeBridgeTokenValidateParams {
  tokenAddress: `0x${string}`;
  tokenSymbol: string;
  fromChainId?: number;
}

interface IStargateTokenValidateParams {
  tokenAddress: `0x${string}`;
  bridgeAddress: `0x${string}`;
  fromChainId?: number;
  tokenSymbol: string;
}

interface IMesonTokenValidateParams {
  fromChainId?: number;
  tokenSymbol: string;
  tokenAddress: `0x${string}`;
  bridgeAddress: `0x${string}`;
}

export const useValidateSendToken = () => {
  // cBridge
  const validateCBridgeToken = async ({
    isPegged,
    fromChainId,
    toChainId,
    tokenAddress,
    bridgeAddress,
    tokenSymbol,
  }: ICBridgeTokenValidateParams) => {
    try {
      if (!fromChainId || !toChainId || !tokenAddress || !bridgeAddress || !tokenSymbol) {
        return false;
      }
      const { data: cBridgeConfig } = await axios.get<ICBridgeTransferConfig>(
        `${CBRIDGE_ENDPOINT}/getTransferConfigsForAll`,
      );
      if (!cBridgeConfig) return false;
      if (isPegged === true) {
        // pegged token
        const peggedToken = cBridgeConfig.pegged_pair_configs.filter((pair) => {
          return (
            (pair.pegged_deposit_contract_addr === bridgeAddress &&
              pair?.org_chain_id === fromChainId &&
              pair?.org_token.token.address === tokenAddress &&
              pair?.org_token.token.symbol === tokenSymbol &&
              pair?.pegged_chain_id === toChainId) ||
            (pair?.pegged_chain_id === fromChainId &&
              pair.pegged_burn_contract_addr === bridgeAddress &&
              pair.pegged_token.token.address === tokenAddress &&
              pair.pegged_token.token.symbol === tokenSymbol &&
              pair?.org_chain_id === toChainId)
          );
        });
        if (!!peggedToken && peggedToken.length > 0) {
          console.log('cBridge pegged token info matched', peggedToken);
          return true;
        }
        console.log('Can not find cBridge pegged info');
        console.log('-- isPegged', isPegged);
        console.log('-- fromChainId', fromChainId);
        console.log('-- tokenAddress', tokenAddress);
        console.log('-- bridgeAddress', bridgeAddress);
        return false;
      } else {
        // bridge address
        const addressInfo = cBridgeConfig.chains.filter((chain) => {
          return chain.id === fromChainId && chain.contract_addr === bridgeAddress;
        });
        // token address
        const tokenInfo = cBridgeConfig.chain_token[fromChainId].token.filter((t) => {
          return (
            t.token.address.toLowerCase() === tokenAddress.toLowerCase() &&
            t.token.symbol === tokenSymbol
          );
        });
        if (addressInfo?.length > 0 && tokenInfo?.length > 0) {
          console.log('cBridge pool info matched', addressInfo, tokenInfo);
          return true;
        } else {
          console.log('Can not find cBridge pool info');
          console.log('-- isPegged', isPegged);
          console.log('-- fromChainId', fromChainId);
          console.log('-- tokenAddress', tokenAddress);
          console.log('-- bridgeAddress', bridgeAddress);
          return false;
        }
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('cBridge token address validation error', error);
      return false;
    }
  };

  // deBridge
  const validateDeBridgeToken = async ({
    fromChainId,
    tokenSymbol,
    tokenAddress,
  }: IDeBridgeTokenValidateParams) => {
    try {
      if (!fromChainId || !tokenAddress || !tokenSymbol) return false;
      const { data: deBridgeConfig } = await axios.get<{
        tokens: { [key: string]: IDeBridgeToken };
      }>(`${DEBRIDGE_ENDPOINT}/token-list?chainId=${fromChainId}`);

      if (!deBridgeConfig?.tokens) return false;
      const tokenInfo = deBridgeConfig.tokens[tokenAddress.toLowerCase()];
      if (
        !!tokenInfo &&
        tokenInfo?.address.toLowerCase() === tokenAddress.toLowerCase() &&
        tokenInfo?.symbol === tokenSymbol
      ) {
        console.log('deBridge token info matched', tokenInfo);
        return true;
      }
      console.log('Could not find deBridge token info');
      console.log('-- fromChainId', fromChainId);
      console.log('-- tokenSymbol', tokenSymbol);
      console.log('-- tokenAddress', tokenAddress);
      return false;
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log('deBridge token validation error', error);
      return false;
    }
  };

  // Stargate
  const validateStargateToken = async ({
    fromChainId,
    tokenAddress,
    bridgeAddress,
    tokenSymbol,
  }: IStargateTokenValidateParams) => {
    try {
      if (!fromChainId || !tokenAddress || !bridgeAddress || !tokenSymbol) return false;
      const { data: stargateConfig } = await axios.get<{ data: IStargateTokenList }>(
        `${STARGATE_ENDPOINT}`,
      );

      // Get chain name by chain id
      const chainKey = stargateChainKey[fromChainId] ?? '';

      if (!chainKey) return false;
      if (!stargateConfig) return false;

      const tokenInfo = stargateConfig.data?.v2?.filter((token) => {
        return (
          token.chainKey === chainKey &&
          token.address.toLowerCase() === bridgeAddress.toLowerCase() &&
          token.token.symbol === tokenSymbol &&
          token.token.address.toLowerCase() === tokenAddress.toLowerCase()
        );
      });

      console.log('tokenInfo', tokenInfo, stargateConfig.data?.v2);
      if (!!tokenInfo && tokenInfo.length > 0) {
        console.log('Stargate token info matched', tokenInfo);
        return true;
      }
      console.log('Could not find Stargate token info');
      console.log('-- fromChainId', fromChainId);
      console.log('-- tokenAddress', tokenAddress);
      console.log('-- bridgeAddress', bridgeAddress);
      console.log('-- tokenSymbol', tokenSymbol);
      return false;
    } catch (error: any) {
      console.log('Stargate token validation error', error);
      return false;
    }
  };

  // Meson
  const validateMesonToken = async ({
    fromChainId,
    tokenSymbol,
    bridgeAddress,
    tokenAddress,
  }: IMesonTokenValidateParams) => {
    try {
      if (!fromChainId || !tokenAddress || !tokenSymbol || !bridgeAddress) return false;
      const { data: mesonConfig } = await axios.get<{ result: IMesonTokenList[] }>(
        `${MESON_ENDPOINT}/limits`,
      );

      const hexNum = fromChainId?.toString(16);
      const chainInfo = mesonConfig.result.filter((chainInfo) => {
        const tokenInfo = chainInfo.tokens.filter(
          (token) =>
            (token?.addr?.toLowerCase() === tokenAddress.toLowerCase() &&
              token.id === tokenSymbol.toLowerCase()) ||
            (!token?.addr &&
              tokenAddress === '0x0000000000000000000000000000000000000000' &&
              token.id === tokenSymbol.toLowerCase()),
        );
        if (!!tokenInfo && tokenInfo.length > 0) {
          console.log('Meson token info', tokenInfo);
        }
        return (
          chainInfo.chainId === `0x${hexNum}` &&
          chainInfo.address.toLowerCase() === bridgeAddress.toLowerCase() &&
          tokenInfo?.length > 0 &&
          !!tokenInfo
        );
      });
      if (!!chainInfo && chainInfo.length > 0) {
        console.log('Meson chain info matched', chainInfo);
        return true;
      }
      console.log('Could not find Meson token');
      console.log('-- fromChainId', fromChainId);
      console.log('-- bridgeAddress', bridgeAddress);
      console.log('-- tokenAddress', tokenAddress);
      console.log('-- tokenSymbol', tokenSymbol);
      return false;
    } catch (error: any) {
      console.log('Meson token validation error', error);
      return false;
    }
  };

  return { validateCBridgeToken, validateDeBridgeToken, validateStargateToken, validateMesonToken };
};
