const TRANSITION = 0.6;
const LEVEL1_PADDING_TOP = 8;
const MENU_WIDTH = 368;
const MENU_WIDTH_PX = `${MENU_WIDTH}px`;

const COLORS = {
  LIGHT: '#F1F2F3',
};

const BNB_CHAIN = [
  {
    chainId: '0x38',
    chainName: 'BNB Smart Chain Mainnet',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
    },
    rpcUrls: ['https://bsc.nodereal.io'],
    blockExplorerUrls: ['https://bscscan.com'],
  },
];

const GREENFIELD_CHAIN = [
  {
    chainId: '0x3f9',
    chainName: 'Greenfield Mainnet',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
    },
    rpcUrls: ['https://greenfield-chain.bnbchain.org'],
    blockExplorerUrls: ['https://greenfieldscan.com/'],
  },
];

const OPBNB_CHAIN = [
  {
    chainId: '0xcc',
    chainName: 'opBNB Mainnet',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
    },
    rpcUrls: ['https://opbnb-mainnet-rpc.bnbchain.org'],
    blockExplorerUrls: ['https://opbnbscan.com'],
  },
];

export {
  TRANSITION,
  LEVEL1_PADDING_TOP,
  MENU_WIDTH,
  MENU_WIDTH_PX,
  COLORS,
  OPBNB_CHAIN,
  BNB_CHAIN,
  GREENFIELD_CHAIN,
};
