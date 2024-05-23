'use client';
import { getDeBridgeTokenList } from '@/bridges/debridge/api';
import { getDeBridgeSupportedChainInfo } from '@/bridges/debridge/api/getDeBridgeSupportedChainInfo';
import {
  DeBridgeSupportedChainsInfo,
  DeBridgeTokenList,
} from '@/bridges/debridge/types';
import { TokenPair } from '@/bridges/types';
import { DEBRIDGE_SUPPORT_CHAINS } from '@/env';
import { useEffect } from 'react';

export default function Debridge() {
  useEffect(() => {
    (async () => {
      const pairedTokenList: TokenPair[] = [];
      try {
        const initChainInfo =
          (await getDeBridgeSupportedChainInfo()) as DeBridgeSupportedChainsInfo;
        console.log(initChainInfo);
        const apiArr = [] as any;
        initChainInfo.chains.forEach(async (chain) => {
          if (DEBRIDGE_SUPPORT_CHAINS.includes(chain.chainId))
            apiArr.push(getDeBridgeTokenList(chain.chainId));
        });
        const tokenList: DeBridgeTokenList[] = await Promise.all(apiArr);
        tokenList.forEach((token, indexOuter) => {
          if (tokenList.length === indexOuter + 1) return;
          for (const [, value] of Object.entries(token.tokens)) {
            tokenList.forEach((tokenInner, indexInner) => {
              if (indexOuter < indexInner) {
                for (const [, value2] of Object.entries(tokenInner.tokens)) {
                  pairedTokenList.push({
                    org_chain_id: initChainInfo.chains[indexOuter].chainId,
                    org_token: {
                      name: value.name,
                      symbol: value.symbol,
                      address: value.address,
                    },
                    dst_chain_id: initChainInfo.chains[indexInner].chainId,
                    dst_token: {
                      name: value2.name,
                      symbol: value2.symbol,
                      address: value2.address,
                    },
                    bridge_type: 'debridge',
                  });
                }
              }
            });
          }
        });
        // console.log(pairedTokenList);
      } catch (error) {}
    })();
  }, []);

  return (
    <div>
      debridge Get Token Pairs
      {/* <TokenList init={initChainInfo} /> */}
    </div>
  );
}

// export async function getServerSideProps() {

//   return { props: { init: initChainInfo } };
// }
