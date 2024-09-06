import { Controller, Get, Inject } from '@nestjs/common';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Controller('counter')
export class CounterController {
  constructor(@Inject(CACHE_MANAGER) private cache: Cache) {}

  @Get()
  async getCount() {
    const count = (await this.cache.get<number>('counter')) || 0;
    await this.cache.set('counter', count + 1);
    return count;
  }
}
