import { BridgeToken } from '@/modules/bridges/main/types';
import { env } from '@/core/configs/env';
import { CBridgeTokenPair } from '@/modules/bridges/cbridge/utils/createCBridgeAdapter';
import { DeBridgeTokenPair } from '@/modules/bridges/debridge/utils/createDeBridgeAdapter';
import { StarGateTokenPair } from '@/modules/bridges/stargate/utils/createStarGateAdapter';

export interface MergeToTokenFuncParams {
  cBridge: {
    tokenPair?: CBridgeTokenPair;
  };
  deBridge: {
    tokenPair?: DeBridgeTokenPair;
  };
  stargate: {
    tokenPair?: StarGateTokenPair;
  };
}

export function mergeSelectedToToken(params: MergeToTokenFuncParams) {
  const { cBridge, deBridge, stargate } = params;

  const cBridgeToken = cBridge.tokenPair?.toToken;
  const deBridgeToken = deBridge.tokenPair?.toToken;
  const stargateToken = stargate.tokenPair?.toToken;

  const isPegged = !!cBridge.tokenPair?.isPegged;
  const peggedPair = cBridge.tokenPair?.peggedPair;

  if (!cBridgeToken && !deBridgeToken && !stargateToken) {
    return;
  }

  const name = (cBridgeToken?.name ?? deBridgeToken?.name ?? stargateToken?.symbol)!;
  const symbol = (cBridgeToken?.token.symbol ?? deBridgeToken?.symbol ?? stargateToken?.symbol)!;
  const decimal = (cBridgeToken?.token.decimal ??
    deBridgeToken?.decimals ??
    stargateToken?.decimals)!;
  const address = (cBridgeToken?.token.address ??
    deBridgeToken?.address ??
    stargateToken?.address)!;

  const bridgeToken: BridgeToken = {
    name,
    icon: `${env.ASSET_PREFIX}/images/tokens/${symbol?.toUpperCase()}.png`,
    address,
    symbol,
    decimal,
    isPegged,
    peggedRawData: {
      cBridge: peggedPair,
    },
    rawData: {
      cBridge: cBridgeToken,
      deBridge: deBridgeToken,
      stargate: stargateToken,
    },
    available: {
      cBridge: !!cBridgeToken,
      deBridge: !!deBridgeToken,
      stargate: !!stargateToken,
    },
  };

  return bridgeToken;
}
