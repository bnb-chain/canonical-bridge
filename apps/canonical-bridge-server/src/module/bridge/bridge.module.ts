import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { Queues } from '@/common/constants';
import { BridgeController } from '@/module/bridge/bridge.controller';
import { BridgeService } from '@/module/bridge/bridge.service';
import { BridgeProcessor } from '@/module/bridge/bridge.processor';
import { BridgeSchedule } from '@/module/bridge/bridge.schedule';

@Module({
  imports: [BullModule.registerQueue({ name: Queues.SyncBridge })],
  controllers: [BridgeController],
  providers: [BridgeService, BridgeProcessor, BridgeSchedule],
})
export class BridgeModule {}