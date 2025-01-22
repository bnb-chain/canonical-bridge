import { Inject, Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '@/shared/database/database.service';
import {
  ICBridgeTransferConfig,
  IDeBridgeTransferConfig,
  IMesonTransferConfig,
  IStargateTransferConfig,
} from '@bnb-chain/canonical-bridge-sdk';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { CACHE_KEY, STARGATE_CHAIN_INFO } from '@/common/constants';

@Injectable()
export class BridgeService {
  private logger = new Logger(BridgeService.name);

  constructor(
    private databaseService: DatabaseService,
    private prismaService: PrismaService,
    @Inject(CACHE_MANAGER) private cache: Cache,
  ) {}

  async test() {
    const tokens = await this.prismaService.token.findMany();
    const dbMap: Record<string, { platform: string }> = {};
    tokens.forEach((e) => {
      if (e.address && e.price) {
        dbMap[e.address.toLowerCase()] = {
          platform: e.platformSlug ?? e.slug,
        };
      }
    });

    // const llamaTokens = await this.prismaService.llamaToken.findMany();
    // llamaTokens.forEach((e) => {
    //   if (e.address && e.price) {
    //     dbMap[e.address?.toLowerCase()] = {
    //       platform:
    //     };
    //   }
    // });

    const cBridge = await this.cache.get<ICBridgeTransferConfig>(CACHE_KEY.CBRIDGE_CONFIG);
    const deBridge = await this.cache.get<IDeBridgeTransferConfig>(CACHE_KEY.DEBRIDGE_CONFIG);
    const stargate = await this.cache.get<IStargateTransferConfig>(CACHE_KEY.STARGATE_CONFIG);
    const meson = await this.cache.get<IMesonTransferConfig>(CACHE_KEY.MESON_CONFIG);

    const bridgeMap: Record<number, string[]> = {};
    Object.entries(cBridge.chain_token).forEach(([key, { token }]) => {
      token.forEach((e) => {
        if (e.token.address) {
          bridgeMap[e.token.address.toLowerCase()] = key;
        }
      });
    });

    Object.entries(deBridge.tokens).forEach(([key, tokens]) => {
      tokens.forEach((e) => {
        if (e.address) {
          bridgeMap[e.address.toLowerCase()] = key;
        }
      });
    });

    stargate.filter((e) => {
      const chainId = STARGATE_CHAIN_INFO.find(
        (t) => t.chainName.toUpperCase() === e.chainKey.toUpperCase(),
      )?.chainId;
      if (chainId && e.token.address) {
        bridgeMap[e.token.address.toLowerCase()] = chainId;
      }
    });

    meson.forEach((chain) => {
      const chainId = Number(chain.chainId);
      if (chainId) {
        chain.tokens.filter((e) => {
          if (e.addr) {
            bridgeMap[e.addr.toLowerCase()] = chainId;
          }
        });
      }
    });

    const result: any = {};
    Object.entries(bridgeMap).forEach(([addr, chainId]) => {
      if (dbMap[addr]) {
        result[dbMap[addr].platform] = chainId;
      }
    });

    console.log(`[test]`, Object.keys(dbMap).length, Object.keys(bridgeMap).length, '===', result);
  }
}
