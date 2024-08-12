/* eslint-disable no-console */
import { downloadIcons } from '../utils/download';
import { getConfigs } from '../utils/get-config';

const cwd = process.cwd();
const OUTPUT_DIR = `${cwd}/public/images/chains`;
const LOG_DIR = __dirname;

function getUrlsMap(bridges: any) {
  const urlsMap: Record<number, string> = {};

  // cBridge
  Object.values(bridges.cBridge.configs.chains).forEach((item: any) => {
    urlsMap[item.id] = item.icon;
  });

  // deBridge
  Object.values(bridges.deBridge.configs.chains).forEach((item: any) => {
    urlsMap[item.chainId] = urlsMap[item.chainId] || '';
  });

  return urlsMap;
}

async function main() {
  const bridges = await getConfigs();
  const urlsMap = getUrlsMap(bridges);

  downloadIcons({
    urlsMap,
    outputDir: OUTPUT_DIR,
    logDir: LOG_DIR,
  });
}

main();
