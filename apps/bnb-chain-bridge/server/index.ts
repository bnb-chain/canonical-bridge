import express from 'express';
import next from 'next';
import compression from 'compression';
import bodyParser from 'body-parser';

import { metrics } from '@/server/middlewares/metrics';
import { routes } from '@/server/routes';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;

const app = next({ dev, hostname, port });

async function main() {
  await app.prepare();

  const server = express();

  server.use(metrics());
  server.use(compression());
  server.use(bodyParser.json());
  server.use('/', routes(app));

  const httpServer = server.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`server listening on: http://localhost:${port}`);
  });

  httpServer.keepAliveTimeout = 60 * 1000 + 1000;
  httpServer.headersTimeout = 60 * 1000 + 2000;
}

main();
