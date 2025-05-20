import { BaseAdapter } from '@/adapters/base';
import { IMayanChain, IMayanToken, IMayanTransferConfig } from '@/adapters/mayan/types.ts';
import { BridgeType, IBridgeTokenBaseInfo } from '@/shared/types.ts';

// todo
export class MayanAdapter extends BaseAdapter<IMayanTransferConfig, IMayanChain, IMayanToken> {
  public id: BridgeType = 'mayan';

  // @ts-ignore
  protected bridgedTokenGroups: [];

  // @ts-ignore
  getChainId(chain: IMayanChain): number {
    return 0;
  }

  // @ts-ignore
  getTokenBaseInfo({ chainId, token }: { chainId: number; token: IMayanToken }): IBridgeTokenBaseInfo {
    // todo
    // @ts-ignore
    return undefined;
  }

  protected initChains(): void {
  }

  protected initTokens(): void {
  }

  protected initTransferMap(): void {
  }

}