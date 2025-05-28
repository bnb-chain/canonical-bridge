import { Inject, Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '@/shared/database/database.service';
import {
  BridgeType,
  EVM_NATIVE_TOKEN_ADDRESS,
  ICBridgeTransferConfig,
  IDeBridgeTransferConfig,
  IMesonTransferConfig,
  IStargateTransferConfig,
  TRON_CHAIN_ID,
  IMayanTransferConfig,
  SOLANA_CHAIN_ID,
} from '@bnb-chain/canonical-bridge-sdk';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { CACHE_KEY } from '@/common/constants';

@Injectable()
export class BridgeService {
  private logger = new Logger(BridgeService.name);

  constructor(
    private databaseService: DatabaseService,
    private prismaService: PrismaService,
    @Inject(CACHE_MANAGER) private cache: Cache,
  ) {}

  async getStatInfo() {
    const cmcMap: Record<string, any[]> = {};
    const tokens = await this.prismaService.token.findMany();
    tokens.forEach((e) => {
      if (e.address) {
        cmcMap[e.address.toLowerCase()] = cmcMap[e.address.toLowerCase()] || [];
        cmcMap[e.address.toLowerCase()].push({
          platform: e.platformSlug,
          address: e.address,
        });
      }
    });

    const llamaMap: Record<string, any[]> = {};
    const llamaTokens = await this.prismaService.llamaToken.findMany();
    llamaTokens.forEach((e) => {
      if (e.address) {
        llamaMap[e.address.toLowerCase()] = llamaMap[e.address.toLowerCase()] || [];
        llamaMap[e.address.toLowerCase()].push({
          platform: e.platform,
          chainId: e.chainId,
          address: e.address,
          price: e.price,
        });
      }
    });

    const cBridge = await this.cache.get<ICBridgeTransferConfig>(CACHE_KEY.CBRIDGE_CONFIG);
    const deBridge = await this.cache.get<IDeBridgeTransferConfig>(CACHE_KEY.DEBRIDGE_CONFIG);
    const stargate = await this.cache.get<IStargateTransferConfig>(CACHE_KEY.STARGATE_CONFIG);
    const meson = await this.cache.get<IMesonTransferConfig>(CACHE_KEY.MESON_CONFIG);
    const mayan = await this.cache.get<IMayanTransferConfig>(CACHE_KEY.MAYAN_CONFIG);

    const tokenCountMap: Record<string, number> = {};
    const bridgeMap: Record<number, string[]> = {};
    const addToBridgeMap = (
      _chainId: number | string,
      tokenAddress: string,
      bridgeType: BridgeType,
    ) => {
      const chainId = Number(_chainId);
      if (!chainId) return;

      bridgeMap[chainId] = bridgeMap[chainId] || [];
      if (!bridgeMap[chainId].includes(tokenAddress?.toLowerCase())) {
        bridgeMap[chainId].push(tokenAddress?.toLowerCase());
        tokenCountMap[bridgeType] = tokenCountMap[bridgeType] ?? 0;
        tokenCountMap[bridgeType]++;
      }
    };

    Object.entries(mayan.tokens).forEach(([nameId, tokens]) => {
      tokens.forEach((token) => {
        const chainId = nameId === 'solana' ? SOLANA_CHAIN_ID : token.chainId;
        addToBridgeMap(chainId, token.contract, 'mayan');
      });
    });

    Object.entries(cBridge.chain_token).forEach(([key, { token }]) => {
      token.forEach((e) => {
        addToBridgeMap(key, e.token.address, 'cBridge');
      });
    });
    cBridge.pegged_pair_configs.forEach((e) => {
      addToBridgeMap(e.org_chain_id, e.org_token.token.address, 'cBridge');
      addToBridgeMap(e.pegged_chain_id, e.pegged_token.token.address, 'cBridge');
    });

    Object.entries(deBridge.tokens).forEach(([key, tokens]) => {
      tokens.forEach((e) => {
        addToBridgeMap(key, e.address, 'deBridge');
      });
    });

    stargate.filter((e) => {
      addToBridgeMap(e.chainId, e.token.address, 'stargate');
    });

    meson.forEach((chain) => {
      const chainId = chain.chainId === 'tron' ? TRON_CHAIN_ID : chain.chainId;
      chain.tokens.filter((e) => {
        addToBridgeMap(chainId, e.addr ?? EVM_NATIVE_TOKEN_ADDRESS, 'meson');
      });
    });

    const cmcSlugMap: Record<any, any> = {};
    Object.entries(bridgeMap).forEach(([key, tokens]) => {
      const chainId = Number(key);

      tokens.forEach((e) => {
        if (cmcMap[e]) {
          cmcMap[e].forEach((e) => {
            cmcSlugMap[chainId] = cmcSlugMap[chainId] ?? [];
            if (!cmcSlugMap[chainId].includes(e.platform)) {
              cmcSlugMap[chainId].push(e.platform);
            }
          });
        }
      });
    });

    return {
      tokenCountMap,
      cmcSlugMap,
      cmcMap,
      llamaMap,
    };
  }
}
