import { env } from '@/core/configs/env';
import { BridgeToken } from '@/modules/bridges/main';
import { isAvailableChainOrToken } from '@/modules/bridges/main/utils/isAvailableChainOrToken';
import { toUpperAddress } from '@/modules/bridges/main';
import { CBridgeTokenPair } from '@/modules/bridges/cbridge/utils/createCBridgeAdapter';
import { DeBridgeTokenPair } from '@/modules/bridges/debridge/utils/createDeBridgeAdapter';

export interface MergeSupportedTokensFuncParams {
  tokenOrder: string[];
  cBridge: {
    availableTokens: Set<string>;
    tokenPairs: CBridgeTokenPair[];
  };
  deBridge: {
    availableTokens: Set<string>;
    tokenPairs: DeBridgeTokenPair[];
  };
}

export function mergeSupportedTokens(params: MergeSupportedTokensFuncParams) {
  const { tokenOrder, cBridge, deBridge } = params;

  const tokens: BridgeToken[] = [];
  const existingMap = new Map<string, BridgeToken>();

  // cBridge tokens
  cBridge.tokenPairs.forEach((item) => {
    const { fromToken, isPegged, peggedPair } = item;

    const isAvailable = cBridge.availableTokens.has(fromToken.token.symbol);

    const bridgeToken: BridgeToken = {
      name: fromToken.name,
      icon: `${env.ASSET_PREFIX}/images/tokens/${fromToken.token.symbol?.toUpperCase()}.png`,
      address: fromToken.token.address,
      symbol: fromToken.token.symbol,
      decimal: fromToken.token.decimal,
      isPegged: !!isPegged,
      peggedRawData: {
        cBridge: isAvailable ? peggedPair : undefined,
      },
      rawData: {
        cBridge: isAvailable ? fromToken : undefined,
      },
      available: {
        cBridge: isAvailable,
      },
    };

    tokens.push(bridgeToken);
    existingMap.set(toUpperAddress(fromToken.token.address), bridgeToken);
  });

  // deBridge tokens
  deBridge.tokenPairs.forEach((item) => {
    const { fromToken } = item;

    const existingToken = existingMap.get(toUpperAddress(fromToken.address));
    const isAvailable = deBridge.availableTokens.has(fromToken.symbol);

    if (existingToken) {
      existingToken.rawData.deBridge = isAvailable ? fromToken : undefined;
      existingToken.available.deBridge = isAvailable;
    } else {
      const bridgeToken: BridgeToken = {
        name: fromToken.name,
        icon: `${env.ASSET_PREFIX}/images/tokens/${fromToken.symbol?.toUpperCase()}.png`,
        address: fromToken.address,
        symbol: fromToken.symbol,
        decimal: fromToken.decimals,
        isPegged: false,
        rawData: {
          deBridge: isAvailable ? fromToken : undefined,
        },
        available: {
          deBridge: isAvailable,
        },
        peggedRawData: {},
      };
      tokens.push(bridgeToken);
    }
  });

  const order = tokenOrder.map((item) => item.toUpperCase());

  tokens.sort((a, b) => {
    const isA = isAvailableChainOrToken(a);
    const isB = isAvailableChainOrToken(b);

    if (isA && !isB) {
      return -1;
    }
    if (!isA && isB) {
      return 1;
    }

    const indexA = order.indexOf(a.symbol.toUpperCase());
    const indexB = order.indexOf(b.symbol.toUpperCase());

    if (indexA > -1 && indexB === -1) {
      return -1;
    }
    if (indexA === -1 && indexB > -1) {
      return 1;
    }
    if (indexA > -1 && indexB > -1) {
      return indexA - indexB;
    }

    return a.symbol < b.symbol ? -1 : 1;
  });

  return tokens;
}
