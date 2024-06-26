import express from 'express';
import { NextServer } from 'next/dist/server/next';
import { parse } from 'url';
import { CBRIDGE_CONFIGS, DEBRIDGE_CONFIGS } from '@/server/data';

const data = {
  cbridge: CBRIDGE_CONFIGS,
  debridge: DEBRIDGE_CONFIGS,
};

export function routes(app: NextServer) {
  const router = express.Router();

  const handle = app.getRequestHandler();

  router.get('/api/getConfigs', async (req, res) => {
    res.status(200).json(data);
  });

  router.all('*', async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  return router;
}
