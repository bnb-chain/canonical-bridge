import { Center, Flex, Link, useColorMode, useIntl, useTheme } from '@bnb-chain/space';
import React from 'react';

import { TokenInfoTooltip } from '@/modules/transfer/components/TransferOverview/RouteInfo/TokenInfoTooltip';
import { IconImage } from '@/core/components/IconImage';
import { useAppSelector } from '@/modules/store/StoreProvider';
import { formatTokenUrl } from '@/core/utils/string';
import { IBridgeTokenBaseInfo } from '@/modules/aggregator/types';
import { AlertIcon } from '@/core/components/icons/AlertIcon';
import { InfoTooltip } from '@/core/components/InfoTooltip';
import { formatAppAddress, isNativeToken } from '@/core/utils/address';

interface RouteTitleProps {
  receiveAmt?: string;
  toTokenInfo?: IBridgeTokenBaseInfo;
  isError?: boolean;
  hoverToShowTokenAddress?: boolean;
}

export const RouteTitle = ({
  receiveAmt,
  toTokenInfo,
  isError,
  hoverToShowTokenAddress = true,
}: RouteTitleProps) => {
  const theme = useTheme();
  const { colorMode } = useColorMode();

  const toChain = useAppSelector((state) => state.transfer.toChain);
  const tokenUrl = formatTokenUrl(toChain?.tokenUrlPattern, toTokenInfo?.address);
  const isNative = isNativeToken(toTokenInfo?.address, toChain?.chainType);

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
      {toTokenInfo && hoverToShowTokenAddress && (
        <TokenInfoTooltip
          chainType={toChain?.chainType}
          tokenInfo={toTokenInfo}
          tokenLinkUrl={tokenUrl}
          isReceiveArea={true}
          data-to-address={toTokenInfo?.address}
          data-to-name={toTokenInfo?.name}
          data-to-symbol={toTokenInfo?.symbol}
          data-to-display-symbol={toTokenInfo?.displaySymbol}
        >
          <ToTokenInfo
            toTokenInfo={toTokenInfo}
            tokenUrl={tokenUrl}
            hoverToShowTokenAddress={hoverToShowTokenAddress}
            isNative={isNative}
          />
        </TokenInfoTooltip>
      )}

      {toTokenInfo && !hoverToShowTokenAddress && (
        <ToTokenInfo
          toTokenInfo={toTokenInfo}
          tokenUrl={tokenUrl}
          hoverToShowTokenAddress={hoverToShowTokenAddress}
          isNative={isNative}
        />
      )}
    </Flex>
  );
};

interface ToTokenInfoProps {
  toTokenInfo: IBridgeTokenBaseInfo;
  tokenUrl: string;
  hoverToShowTokenAddress: boolean;
  isNative: boolean;
}

export const ToTokenInfo = React.forwardRef(
  (props: ToTokenInfoProps, ref: React.LegacyRef<HTMLDivElement>) => {
    const {
      toTokenInfo,
      tokenUrl,
      hoverToShowTokenAddress = true,
      isNative = false,
      ...restProps
    } = props;
    const theme = useTheme();
    const { colorMode } = useColorMode();
    const { formatMessage } = useIntl();

    return (
      <Flex
        className="bccb-widget-route-token-icon"
        flexDir={'row'}
        gap={'4px'}
        alignItems={'center'}
        fontSize={'14px'}
        fontWeight={500}
        lineHeight={'20px'}
        display="inline-flex"
        ref={ref}
        {...restProps}
      >
        <IconImage
          src={toTokenInfo.icon}
          w={'16px'}
          h={'16px'}
          fallbackBgColor={theme.colors[colorMode].support.primary[4]}
        />
        <Flex>{toTokenInfo.displaySymbol}</Flex>
        {!hoverToShowTokenAddress && !isNative && (
          <Flex
            alignItems="center"
            color={theme.colors[colorMode].text.tertiary}
            justifyContent="flex-start"
            className="bccb-widget-route-token-to-address"
            data-to-address={toTokenInfo.address}
            data-to-name={toTokenInfo.name}
            data-to-symbol={toTokenInfo.symbol}
            data-to-display-symbol={toTokenInfo.displaySymbol}
          >
            <Link
              href={tokenUrl}
              isExternal
              color={theme.colors[colorMode].text.tertiary}
              mx="4px"
              sx={{
                '@media (hover:hover)': {
                  _hover: {
                    color: theme.colors[colorMode].text.primary,
                  },
                },
              }}
            >
              (
              {formatAppAddress({
                address: toTokenInfo.address,
              })}
              )
            </Link>
            <InfoTooltip
              label={formatMessage({ id: 'route.token-address.tips' })}
              maxW={'250px'}
              placement="top"
              hasArrow
            >
              <Center>
                <AlertIcon />
              </Center>
            </InfoTooltip>
          </Flex>
        )}
      </Flex>
    );
  },
);

ToTokenInfo.displayName = 'ToTokenInfo';
