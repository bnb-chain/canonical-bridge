import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { Queues } from '@/common/constants';
import { ConfigController } from '@/module/config/config.controller';
import { ConfigProcessor } from '@/module/config/config.processor';
import { ConfigSchedule } from '@/module/config/config.schedule';
import { ConfigService } from '@/module/config/config.service';

@Module({
  imports: [BullModule.registerQueue({ name: Queues.SyncConfig })],
  controllers: [ConfigController],
  providers: [ConfigService, ConfigProcessor, ConfigSchedule],
})
export class ConfigModule {}
