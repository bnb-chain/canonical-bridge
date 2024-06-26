import express from 'express';
import next from 'next';
import compression from 'compression';
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
  server.use('/', routes(app));

  server.listen(port, () => {
    console.log(`server listening on: http://localhost:${port}`);
  });
}

main();
