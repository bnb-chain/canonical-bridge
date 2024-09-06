import { Injectable } from '@nestjs/common';
import { HealthIndicator } from '@nestjs/terminus';

@Injectable()
export class PongIndicator extends HealthIndicator {
  isHealthy() {
    return this.getStatus('pong', true);
  }
}
