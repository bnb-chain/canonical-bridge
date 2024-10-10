import { parse } from 'url';

import express, { Request, Response } from 'express';
import { NextServer } from 'next/dist/server/next';

import { getTransferConfig } from '@/server/data';

export function routes(app: NextServer) {
  const router = express.Router();
  const handle = app.getRequestHandler();

  // The url to access the server must start with `https://bnbchain.org/[lang]/bnb-chain-bridge`,
  // so we add `*` in the front.
  router.get('*/api/getTransferConfig', async (req: Request, res: Response) => {
    const transferConfig = getTransferConfig();
    res.status(200).json(transferConfig);
  });

  router.all('*', async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  return router;
}
