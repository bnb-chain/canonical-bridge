import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ENDPOINT_PREFIX, SERVER_PORT } from './common/constants';
import { Logger } from '@nestjs/common';
import promBundle from 'express-prom-bundle';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const metricsMiddleware = promBundle({
  includeMethod: true,
  includePath: true,
  promClient: {
    collectDefaultMetrics: {
      prefix: 'canonical_bridge_server_',
    },
  },
});

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  app.setGlobalPrefix(ENDPOINT_PREFIX, {
    exclude: ['metrics', 'ping'],
  });

  const config = new DocumentBuilder()
    .setTitle('Canonical bridge server')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(ENDPOINT_PREFIX, app, document);

  app.use(metricsMiddleware);

  const server = await app.listen(SERVER_PORT, () => {
    logger.log('Listening on port', SERVER_PORT);
  });

  server.keepAliveTimeout = 61 * 1000;
  server.headersTimeout = 62 * 1000;
}

bootstrap();
