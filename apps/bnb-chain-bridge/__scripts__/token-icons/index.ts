/* eslint-disable no-console */
import { downloadIcons } from '../utils/download';
import { getConfigs } from '../utils/get-config';

const cwd = process.cwd();
const OUTPUT_DIR = `${cwd}/public/images/tokens`;
const LOG_DIR = __dirname;

function getUrlsMap(bridges: any) {
  const urlsMap: Record<string, string> = {};

  // cBridge
  Object.values(bridges.cBridge.configs.chain_token).forEach((item: any) => {
    item.token.forEach((item: any) => {
      urlsMap[item.token.symbol] = item.icon;
    });
  });

  bridges.cBridge.configs.pegged_pair_configs.forEach((item: any) => {
    urlsMap[item.org_token.token.symbol] = item.org_token.icon;
    urlsMap[item.pegged_token.token.symbol] = item.pegged_token.icon;
  });

  // deBridge
  Object.values(bridges.deBridge.configs.chain_token).forEach((item: any) => {
    item.forEach((item: any) => {
      urlsMap[item.symbol] = item.logoURI;
    });
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
