export type ChainProps = {
  chainId: string | number;
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: string[];
  blockExplorerUrls: string[];
};

export type WalletOptionProps = {
  tooltipContent: string;
  analyticsId: string;
  chain: ChainProps[];
  id: string;
  key?: string;
};

export type AddNetworkProps = {
  title: string;
  options: WalletOptionProps[];
};
