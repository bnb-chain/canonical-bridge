import deBridgeChainList from './chain_list.json';
import deBridgeTokenList1 from './token_list/chain_id_1.json';
import deBridgeTokenList10 from './token_list/chain_id_10.json';
import deBridgeTokenList56 from './token_list/chain_id_56.json';
import deBridgeTokenList137 from './token_list/chain_id_137.json';
import deBridgeTokenList8453 from './token_list/chain_id_8453.json';
import deBridgeTokenList42161 from './token_list/chain_id_42161.json';
import deBridgeTokenList43114 from './token_list/chain_id_43114.json';
import deBridgeTokenList59144 from './token_list/chain_id_59144.json';
import deBridgeTokenList7565164 from './token_list/chain_id_7565164.json';
import deBridgeTokenList100000001 from './token_list/chain_id_100000001.json';
import deBridgeTokenList100000002 from './token_list/chain_id_100000002.json';
import deBridgeTokenList100000003 from './token_list/chain_id_100000003.json';

const rawConfigs = {
  chains: deBridgeChainList.chains,
  tokens: {
    1: Object.values(deBridgeTokenList1.tokens),
    10: Object.values(deBridgeTokenList10.tokens),
    56: Object.values(deBridgeTokenList56.tokens),
    137: Object.values(deBridgeTokenList137.tokens),
    8453: Object.values(deBridgeTokenList8453.tokens),
    42161: Object.values(deBridgeTokenList42161.tokens),
    43114: Object.values(deBridgeTokenList43114.tokens),
    59144: Object.values(deBridgeTokenList59144.tokens),
    7565164: Object.values(deBridgeTokenList7565164.tokens),
    100000001: Object.values(deBridgeTokenList100000001.tokens),
    100000002: Object.values(deBridgeTokenList100000002.tokens),
    100000003: Object.values(deBridgeTokenList100000003.tokens),
  },
};

const extraConfigs: Record<number, any[]> = {
  1: [
    {
      action: 'replace',
      target: '0xebd9d99a3982d547c5bb4db7e3b1f9f14b67eb83',
      data: {
        address: '0x2dfF88A56767223A5529eA5960Da7A3F5f766406',
        symbol: 'ID',
        decimals: 18,
        name: 'SPACE ID',
        logoURI: '',
        eip2612: false,
        tags: ['tokens'],
      },
    },
    {
      action: 'append',
      data: {
        address: '0x152649eA73beAb28c5b49B26eb48f7EAD6d4c898',
        symbol: 'Cake',
        decimals: 18,
        name: 'PancakeSwap Token',
        logoURI: '',
        eip2612: false,
        tags: ['tokens'],
      },
    },
  ],
  // 56: [
  //   {
  //     action: 'replace',
  //     target: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
  //     data: {
  //       address: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
  //       symbol: 'Cake',
  //       decimals: 18,
  //       name: 'PancakeSwap Token',
  //       logoURI: 'https://tokens.1inch.io/0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82.png',
  //       eip2612: false,
  //       tags: ['tokens'],
  //     },
  //   },
  // ],
};

const deBridgeConfig = {
  ...rawConfigs,
};

Object.entries(deBridgeConfig.tokens).forEach(([key, value]) => {
  const chainId = Number(key);
  const extraConfig = extraConfigs[chainId];

  if (extraConfig) {
    extraConfig.forEach((item) => {
      const { action, target, data } = item;
      if (!value[data.address]) {
        if (action === 'replace') {
          const index = value.findIndex((item) => item.address === target);
          if (index > -1) {
            value[index] = data;
          }
        } else if (action === 'append') {
          (value as any).push(data);
        }
      }
    });
  }
});

export default deBridgeConfig;
