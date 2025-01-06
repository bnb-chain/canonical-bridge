import { Flex, Link, useBreakpointValue, useColorMode, useIntl, useTheme } from '@bnb-chain/space';
import { useMemo } from 'react';

import { useAppSelector } from '@/modules/store/StoreProvider';
import { useGetReceiveAmount } from '@/modules/transfer/hooks/useGetReceiveAmount';
import { useToTokenInfo } from '@/modules/transfer/hooks/useToTokenInfo';
import { TransferToIcon } from '@/core/components/icons/TransferToIcon';
import { TokenInfo } from '@/modules/transfer/components/Modal/TransactionSummaryModal/TokenInfo';
import { formatTokenUrl } from '@/core/utils/string';
import { WarningMessage } from '@/modules/transfer/components/TransferWarningMessage/WarningMessage';
import { formatAppAddress, isNativeToken } from '@/core/utils/address';

export const TransferSummary = () => {
  const { colorMode } = useColorMode();
  const theme = useTheme();
  const { getSortedReceiveAmount } = useGetReceiveAmount();
  const { formatMessage } = useIntl();
  const isBase = useBreakpointValue({ base: true, md: false }) ?? false;

  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const toChain = useAppSelector((state) => state.transfer.toChain);
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const sendValue = useAppSelector((state) => state.transfer.sendValue);
  const transferActionInfo = useAppSelector((state) => state.transfer.transferActionInfo);
  const { toTokenInfo } = useToTokenInfo();

  const receiveAmt = useMemo(() => {
    if (!Number(sendValue)) return null;
    if (transferActionInfo && transferActionInfo.bridgeType) {
      const bridgeType = transferActionInfo.bridgeType;
      const receiveValue = getSortedReceiveAmount();
      return Number(receiveValue[bridgeType].value);
    }
    return null;
  }, [getSortedReceiveAmount, transferActionInfo, sendValue]);

  const isNative = useMemo(
    () => isNativeToken(toTokenInfo?.address, toChain?.chainType),
    [toTokenInfo?.address, toChain?.chainType],
  );

  return (
    <Flex
      flexDir={'column'}
      alignItems={'center'}
      padding={'12px'}
      gap={'4px'}
      borderRadius={'8px'}
      bg={theme.colors[colorMode].background.modal}
    >
      <TokenInfo
        chainIconUrl={fromChain?.icon}
        tokenIconUrl={selectedToken?.icon}
        chainName={fromChain?.name}
        amount={!!sendValue ? `-${sendValue}` : ''}
        tokenSymbol={selectedToken?.symbol ?? ''}
      />
      <TransferToIcon
        w={'24px'}
        h={'24px'}
        mb={{ base: '-4px' }}
        transform={'rotate(90deg)'}
        iconopacity="1"
      />
      <TokenInfo
        chainIconUrl={toChain?.icon}
        tokenIconUrl={toTokenInfo?.icon}
        chainName={toChain?.name}
        amount={!!receiveAmt ? `+${receiveAmt}` : ''}
        tokenSymbol={toTokenInfo?.symbol ?? ''}
      />
      <WarningMessage
        text={
          <span>
            {!isNative ? (
              <>
                <span style={{ marginRight: '2px' }}>
                  {formatMessage({ id: 'transfer.warning.confirm.to.address' })}
                </span>
                <Link
                  isExternal
                  href={formatTokenUrl(toChain?.tokenUrlPattern, toTokenInfo?.address)}
                  display="inline-block"
                  overflowWrap={'break-word'}
                  pointerEvents={'all'}
                  color="currentColor"
                >
                  {isBase
                    ? formatAppAddress({ address: toTokenInfo?.address, isTruncated: true })
                    : toTokenInfo?.address}
                </Link>
              </>
            ) : (
              <>
                <span style={{ marginRight: '2px' }}>
                  {formatMessage({ id: 'transfer.warning.confirm.to.native.token.address' })}
                </span>
                <span>{toTokenInfo?.symbol?.toUpperCase()}</span>
              </>
            )}
          </span>
        }
      />
    </Flex>
  );
};
