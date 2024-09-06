import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { PongIndicator } from './ping.health';

@Controller('ping')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private pong: PongIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([() => this.pong.isHealthy()]);
  }
}
