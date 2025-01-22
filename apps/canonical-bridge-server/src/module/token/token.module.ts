import { Module } from '@nestjs/common';
import { TokenController } from './token.controller';
import { TokenService } from './token.service';
import { TokenSchedule } from './token.schedule';
import { BullModule } from '@nestjs/bullmq';
import { Queues } from '@/common/constants';
import { TokenProcessor } from '@/module/token/token.processor';
import { UtilService } from '@/shared/util/util.service';

@Module({
  imports: [BullModule.registerQueue({ name: Queues.SyncToken })],
  controllers: [TokenController],
  providers: [TokenProcessor, TokenService, TokenSchedule, UtilService],
})
export class TokenModule {}
