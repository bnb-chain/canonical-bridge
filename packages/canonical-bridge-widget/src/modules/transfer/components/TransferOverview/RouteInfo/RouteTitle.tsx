import { Flex, useColorMode, useTheme } from '@bnb-chain/space';
import { IBridgeTokenBaseInfo } from '@bnb-chain/canonical-bridge-sdk';

import { TokenInfoTooltip } from '@/modules/transfer/components/TransferOverview/RouteInfo/TokenInfoTooltip';
import { IconImage } from '@/core/components/IconImage';
import { useAppSelector } from '@/modules/store/StoreProvider';
import { formatTokenUrl } from '@/core/utils/string';

interface RouteTitleProps {
  receiveAmt?: string;
  toTokenInfo?: IBridgeTokenBaseInfo;
  isError?: boolean;
}

export const RouteTitle = ({ receiveAmt, toTokenInfo, isError }: RouteTitleProps) => {
  const theme = useTheme();
  const { colorMode } = useColorMode();

  const toChain = useAppSelector((state) => state.transfer.toChain);
  const tokenUrl = formatTokenUrl(toChain?.tokenUrlPattern, toTokenInfo?.address);

  return (
    <Flex
      className="bccb-widget-route-token"
      flexDir={'row'}
      gap={'8px'}
      display={'inline'}
      opacity={isError ? 0.5 : 1}
    >
      <Flex
        className="bccb-widget-route-title-amount"
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
          chainType={toChain?.chainType}
          tokenAddress={toTokenInfo.address}
          tokenLinkUrl={tokenUrl}
          isReceiveArea={true}
        >
          <Flex
            className="bccb-widget-route-token-icon"
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
