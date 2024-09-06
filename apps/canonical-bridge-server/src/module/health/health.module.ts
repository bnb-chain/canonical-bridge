import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { PongIndicator } from './ping.health';

@Module({
  imports: [TerminusModule],
  controllers: [HealthController],
  providers: [PongIndicator],
})
export class HealthModule {}
