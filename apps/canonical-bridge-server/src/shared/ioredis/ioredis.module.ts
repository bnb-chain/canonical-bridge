import { Global, Module } from '@nestjs/common';
import { IoredisService } from './ioredis.service';

@Global()
@Module({
  providers: [IoredisService],
  exports: [IoredisService],
})
export class IoredisModule {}
