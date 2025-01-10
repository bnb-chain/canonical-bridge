import { BridgeType } from '@/shared/types';

export interface IGlobalConfig {
  displayTokenSymbols: Record<number, Record<string, string>>;
  providers: Array<{ id: BridgeType; enabled: boolean }>;
}
