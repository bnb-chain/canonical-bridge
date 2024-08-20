/* eslint-disable no-console */
import axios from 'axios';

import { downloadIcons } from '../utils/download';
import { getConfigs } from '../utils/get-config';

const cwd = process.cwd();
const OUTPUT_DIR = `${cwd}/public/images/chains`;
const CHAIN_LIST = 'https://chainid.network/page-data/sq/d/3672587576.json';
const LOG_DIR = __dirname;

async function getIconMap() {
  const allChains = (await axios.get(CHAIN_LIST)).data?.data.allChain.nodes;
  const iconMap: Record<number, string> = {};
  allChains.forEach((item: any) => {
    if (item.icon?.publicURL) {
      iconMap[item.chainId] = `https://chainid.network${item.icon.publicURL}`;
    }
  });
  return iconMap;
}

function getUrlsMap(bridges: any, iconMap: Record<number, string>) {
  const urlsMap: Record<number, string> = {};

  // cBridge
  Object.values(bridges.cBridge.configs.chains).forEach((item: any) => {
    urlsMap[item.id] = item.icon || iconMap[item.id];
  });

  // deBridge
  Object.values(bridges.deBridge.configs.chains).forEach((item: any) => {
    urlsMap[item.chainId] = urlsMap[item.chainId] || iconMap[item.chainId];
  });

  // stargate
  Object.values(bridges.stargate.configs.chains).forEach((item: any) => {
    urlsMap[item.chainId] = urlsMap[item.chainId] || iconMap[item.chainId];
  });

  console.log(iconMap, '==');

  return urlsMap;
}

async function main() {
  const iconMap = await getIconMap();
  const bridges = await getConfigs();
  const urlsMap = getUrlsMap(bridges, iconMap);

  downloadIcons({
    urlsMap,
    outputDir: OUTPUT_DIR,
    logDir: LOG_DIR,
  });
}

main();
