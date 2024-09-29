import { Flex, useColorMode, useTheme } from '@bnb-chain/space';

import { TokenInfoTooltip } from '@/modules/transfer/components/TransferOverview/RouteInfo/TokenInfoTooltip';
import { IconImage } from '@/core/components/IconImage';
import { useAppSelector } from '@/modules/store/StoreProvider';
import { formatTokenUrl } from '@/core/utils/string';
import { IBridgeTokenBaseInfo } from '@/modules/aggregator/types';

interface RouteTitleProps {
  receiveAmt?: string;
  toTokenInfo?: IBridgeTokenBaseInfo;
}

export const RouteTitle = ({ receiveAmt, toTokenInfo }: RouteTitleProps) => {
  const theme = useTheme();
  const { colorMode } = useColorMode();

  const toChain = useAppSelector((state) => state.transfer.toChain);
  const tokenUrl = formatTokenUrl(toChain?.tokenUrlPattern, toTokenInfo?.address);

  return (
    <Flex flexDir={'row'} gap={'8px'} display={'inline'}>
      <Flex
        fontSize={'24px'}
        fontWeight={500}
        lineHeight={'32px'}
        wordBreak={'break-all'}
        display={'inline'}
        mr={'8px'}
        color={theme.colors[colorMode].text.primary}
      >
        {receiveAmt}
      </Flex>
      {toTokenInfo && (
        <TokenInfoTooltip
          tokenAddress={toTokenInfo.address}
          tokenLinkUrl={tokenUrl}
          isReceiveArea={true}
        >
          <Flex
            flexDir={'row'}
            gap={'4px'}
            alignItems={'center'}
            fontSize={'14px'}
            fontWeight={500}
            lineHeight={'20px'}
          >
            <IconImage
              src={toTokenInfo.icon}
              w={'16px'}
              h={'16px'}
              fallbackBgColor={theme.colors[colorMode].support.primary[4]}
            />
            <Flex>{toTokenInfo.displaySymbol}</Flex>
          </Flex>
        </TokenInfoTooltip>
      )}
    </Flex>
  );
};
