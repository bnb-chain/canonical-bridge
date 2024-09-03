/* eslint-disable no-console */
import { parse } from 'url';

import express, { Request, Response } from 'express';
import { NextServer } from 'next/dist/server/next';
import axios from 'axios';

import { bridgeConfigs } from '@/server/data';
import { chains } from '@/server/data/chains';
import { rpcMap } from '@/server/data/rpcMap';
import { testnetChains } from '@/server/data/chains-testnet';

export function routes(app: NextServer) {
  const router = express.Router();
  const handle = app.getRequestHandler();

  // The url to access the server must start with `https://bnbchain.org/[lang]/bnb-chain-bridge`,
  // so we add `*` in the front.

  // get bridge configs
  router.get('*/api/getConfigs', (req: Request, res: Response) => {
    if (process.env.NEXT_PUBLIC_NETWORK !== 'testnet') {
      bridgeConfigs.stargate.exclude.chains = [97, 1001, 421614, 11155111, 11155420] as any;
    }
    res.status(200).json(bridgeConfigs);
  });

  router.get('*/api/getChainConfigs', (req: Request, res: Response) => {
    if (process.env.NEXT_PUBLIC_NETWORK === 'testnet') {
      res.status(200).json(chains.concat(testnetChains));
    } else {
      res.status(200).json(chains);
    }
  });

  // rpc proxies
  router.all(`*/rpc/*`, async (req: Request, res: Response) => {
    const chainName = /\/rpc\/(.*)/.exec(req.url)?.[1] ?? '';
    const rpcUrl = rpcMap[chainName];
    if (!rpcUrl) {
      res.status(404).end();
      return;
    }

    try {
      const result = (
        await axios({
          url: rpcUrl,
          method: req.method,
          data: req.body,
          params: req.query,
          timeout: 60 * 1000,
        })
      ).data;
      res.status(200).json(result);
    } catch (err: any) {
      const result = err?.response?.data ?? {
        error: 'internal error',
      };

      console.error(result);
      res.status(500).json(result);
    }
  });

  // other
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
