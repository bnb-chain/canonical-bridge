import { Flex, useColorMode, useTheme } from '@bnb-chain/space';
import { useMemo } from 'react';

import { TokenInfoTooltip } from '@/modules/transfer/components/TransferOverview/RouteInfo/TokenInfoTooltip';
import { IconImage } from '@/core/components/IconImage';
import { useAppSelector } from '@/modules/store/StoreProvider';
import { formatTokenUrl } from '@/core/utils/string';
import { IBridgeToken } from '@/modules/aggregator/types';

interface RouteTitleProps {
  receiveAmt?: string;
  decimals?: number;
  tokenAddress?: string;
  toTokenInfo?: IBridgeToken;
}

export const RouteTitle = ({ receiveAmt, tokenAddress, toTokenInfo }: RouteTitleProps) => {
  const theme = useTheme();
  const { colorMode } = useColorMode();

  const toChain = useAppSelector((state) => state.transfer.toChain);

  const tokenUrl = useMemo(() => {
    return toTokenInfo ? formatTokenUrl(toChain?.tokenUrlPattern, toTokenInfo.address) : '';
  }, [toTokenInfo, toChain?.tokenUrlPattern]);

  return (
    <Flex flexDir={'row'} gap={'8px'}>
      <Flex
        fontSize={'24px'}
        fontWeight={500}
        lineHeight={'32px'}
        color={theme.colors[colorMode].text.primary}
      >
        {receiveAmt}
      </Flex>
      {toTokenInfo && tokenAddress && (
        <TokenInfoTooltip tokenAddress={tokenAddress} tokenLinkUrl={tokenUrl}>
          <Flex
            flexDir={'row'}
            gap={'4px'}
            alignItems={'center'}
            fontSize={'14px'}
            fontWeight={500}
            lineHeight={'20px'}
          >
            <IconImage
              src={toTokenInfo?.icon}
              w={'16px'}
              h={'16px'}
              fallbackBgColor={theme.colors[colorMode].support.primary[4]}
            />
            <Flex>{toTokenInfo?.symbol}</Flex>
          </Flex>
        </TokenInfoTooltip>
      )}
    </Flex>
  );
};
