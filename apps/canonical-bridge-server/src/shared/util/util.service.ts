import { chains } from '@/common/constants/chains';
import { Injectable, Logger } from '@nestjs/common';
import { AxiosRequestConfig } from '@nestjs/terminus/dist/health-indicator/http/axios.interfaces';

@Injectable()
export class UtilService {
  private logger = new Logger(UtilService.name);

  web3AxiosRequest(config: AxiosRequestConfig) {
    return JSON.stringify(config);
  }

  web3AxiosResponse(data) {
    const res = JSON.parse(data);
    if (res?.error) {
      this.logger.error(data);
      return;
    }
    // todo
    return Array.isArray(res) ? res.map((r) => r.result || r) : res.result || res.data || res;
  }

  public getFormattedAddress(chainId?: number, address?: string) {
    const chainInfo = chains.find((e) => e.id === chainId);
    if (chainInfo?.chainType !== 'evm') {
      return address;
    }
    return address?.toLowerCase();
  }

  public getChainConfigByCmcPlatform(platform: string) {
    return chains.find((e) => e.extra?.cmcPlatform === platform);
  }

  public getChainConfigByLlamaPlatform(platform: string) {
    return chains.find((e) => e.extra?.llamaPlatform === platform);
  }

  public getChainConfigByChainId(chainId: number) {
    return chains.find((e) => e.id === chainId);
  }

  public getChainCmcPlatforms() {
    return chains.filter((e) => e.extra?.cmcPlatform).map((e) => e.extra?.cmcPlatform);
  }

  public getChainLlamaPlatforms() {
    return chains.filter((e) => e.extra?.llamaPlatform).map((e) => e.extra?.llamaPlatform);
  }

  public getChainIds() {
    return chains.map((e) => e.id);
  }
}
