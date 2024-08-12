/* eslint-disable no-console */

import fs from 'fs';

import * as cheerio from 'cheerio';
import axios from 'axios';

import { getConfigs } from '../utils/get-config';

const cwd = process.cwd();
const OUTPUT_PATH = `${cwd}/server/data/chains.json`;
const LOG_DIR = __dirname;
const CHAIN_LIST_WEBSITE = 'https://chainlist.org/';

const EXPLORERS = {
  1024: {
    name: 'CLV Blockchain Explore',
    url: 'https://clvscan.com/',
  },
} as any;

async function getAllChains() {
  const htmlText = (await axios.get(CHAIN_LIST_WEBSITE)).data;
  const $ = cheerio.load(htmlText);
  const chains = JSON.parse($('#__NEXT_DATA__').text()).props.pageProps.chains;
  return chains;
}

function getChainIds(bridges: any) {
  const chainIds: number[] = [];

  // cBridge
  bridges.cBridge.configs.chains.forEach((item: any) => {
    chainIds.push(item.id);
  });

  // deBridge
  bridges.deBridge.configs.chains.forEach((item: any) => {
    if (!chainIds.includes(item.chainId)) {
      chainIds.push(item.chainId);
    }
  });

  return chainIds;
}

function getChainConfigs(chains: any[], chainIds: number[]) {
  const chainsMap: Record<number, any> = {};
  chains.forEach((item) => {
    chainsMap[item.chainId] = item;
  });

  const failureMap: Record<string, any> = {
    noChainInfo: [],
    noExplorer: [],
    noRpc: [],
  };
  const result: any[] = [];
  chainIds.forEach((id) => {
    const item = chainsMap[id];
    if (item) {
      const llamaRpc = item.rpc.find((item: any) => item.url.includes('llamarpc'));
      const officialRpc = item.rpc.find(
        (item: any) => !item.url.includes('llamarpc') && item.url.includes('http'),
      );
      const rpcUrl = (officialRpc ?? llamaRpc)?.url ?? '';

      const explorer = EXPLORERS[item.chainId] ?? item.explorers?.[0] ?? {};
      const blockExplorer = { name: explorer.name || '', url: explorer.url || '' };

      if (!item.explorers?.[0]) {
        failureMap.noExplorer.push(item);
      }
      if (!rpcUrl) {
        failureMap.noRpc.push(item);
      }

      result.push({
        id: item.chainId,
        name: item.name,
        nativeCurrency: item.nativeCurrency,
        rpcUrls: {
          default: {
            http: [rpcUrl],
          },
          public: {
            http: [rpcUrl],
          },
        },
        blockExplorers: {
          default: blockExplorer,
        },
      });
    } else {
      failureMap.noChainInfo.push(id);
    }
  });

  return {
    result,
    failureMap,
  };
}

async function main() {
  const [chains, bridges] = await Promise.all([getAllChains(), getConfigs()]);

  const chainIds = getChainIds(bridges);
  const { result, failureMap } = getChainConfigs(chains, chainIds);

  const failureLogPath = `${LOG_DIR}/failure.json`;
  fs.writeFileSync(failureLogPath, JSON.stringify(failureMap, null, 2));
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(result, null, 2));
}

main();
