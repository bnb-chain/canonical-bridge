import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { DatabaseModule } from './shared/database/database.module';
import { PrismaModule } from './shared/prisma/prisma.module';
import { UtilModule } from './shared/util/util.module';
import { IoredisModule } from './shared/ioredis/ioredis.module';
import { HealthModule } from './module/health/health.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisOptions } from 'ioredis';
import { redisStore } from 'cache-manager-ioredis-yet';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AllExceptionFilter } from './common/filters/all-exception.filter';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';
import { REDIS_HOST, REDIS_PORT } from './common/constants';
import { TokenModule } from './module/token/token.module';
import { BullModule } from '@nestjs/bullmq';
import { Web3Module } from '@/shared/web3/web3.module';

@Module({
  imports: [
    Web3Module,
    TokenModule,
    DatabaseModule,
    PrismaModule,
    UtilModule,
    IoredisModule,
    HealthModule,
    ScheduleModule.forRoot(),
    CacheModule.register<RedisOptions>({
      isGlobal: true,
      store: () => redisStore({ host: REDIS_HOST, port: REDIS_PORT }),
    }),
    BullModule.forRoot({
      connection: { host: REDIS_HOST, port: REDIS_PORT },
      defaultJobOptions: {
        attempts: 3,
        removeOnComplete: 10000,
      },
    }),
  ],
  providers: [
    { provide: APP_FILTER, useClass: AllExceptionFilter },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
    { provide: APP_INTERCEPTOR, useClass: TimeoutInterceptor },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
