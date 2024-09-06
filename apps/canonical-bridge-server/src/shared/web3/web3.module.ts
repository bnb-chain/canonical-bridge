import { Global, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { Web3Service } from '@/shared/web3/web3.service';
import { SERVER_TIMEOUT } from '@/common/constants';
import { UtilService } from '@/shared/util/util.service';
import { UtilModule } from '@/shared/util/util.module';

@Global()
@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [UtilModule],
      inject: [UtilService],
      useFactory(utilService: UtilService) {
        return {
          timeout: SERVER_TIMEOUT,
          transformResponse: [utilService.web3AxiosResponse.bind(utilService)],
          transformRequest: [utilService.web3AxiosRequest.bind(utilService)],
        };
      },
    }),
  ],
  providers: [Web3Service],
  exports: [Web3Service],
})
export class Web3Module {}
