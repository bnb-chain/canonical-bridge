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
    return Array.isArray(res) ? res.map((r) => r.result) : res.result || res.data || res;
  }
}
