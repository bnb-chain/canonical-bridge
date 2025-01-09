import { Flex, Link, useBreakpointValue, useColorMode, useIntl, useTheme } from '@bnb-chain/space';
import { useMemo } from 'react';
import { BridgeType } from '@bnb-chain/canonical-bridge-sdk';

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
  const { getToTokenAddress, toTokenInfo, getToTokenSymbol } = useToTokenInfo();

  const bridgeType = useMemo(
    () => transferActionInfo?.bridgeType,
    [transferActionInfo],
  ) as BridgeType;
  const receiveAmt = useMemo(() => {
    if (!Number(sendValue)) return null;
    if (bridgeType) {
      const receiveValue = getSortedReceiveAmount();
      return Number(receiveValue[bridgeType].value);
    }
    return null;
  }, [getSortedReceiveAmount, bridgeType, sendValue]);

  const toTokenAddress = useMemo(() => {
    return bridgeType ? getToTokenAddress()[bridgeType] : '';
  }, [bridgeType, getToTokenAddress]);

  const isNative = useMemo(
    () => isNativeToken(toTokenAddress, toChain?.chainType),
    [toTokenAddress, toChain?.chainType],
  );

  const isLongFromAmount = useMemo(() => {
    if (isBase) return true;
    try {
      if (sendValue && selectedToken?.symbol) {
        return sendValue.length + selectedToken.symbol.length - 1 > 16;
      }
    } catch {}
    return false;
  }, [sendValue, selectedToken?.symbol, isBase]);

  const isLongToAmount = useMemo(() => {
    if (isBase) return true;
    try {
      if (receiveAmt && toTokenInfo?.symbol) {
        return String(receiveAmt).length + toTokenInfo?.symbol.length - 1 > 16;
      }
    } catch {}
    return false;
  }, [receiveAmt, toTokenInfo?.symbol, isBase]);

  return (
    <Flex
      flexDir={'column'}
      alignItems={'center'}
      padding={'12px'}
      gap={'4px'}
      borderRadius={'8px'}
      bg={theme.colors[colorMode].background.modal}
      className="bccb-widget-transaction-summary-modal-summary-wrapper"
    >
      <TokenInfo
        chainIconUrl={fromChain?.icon}
        tokenIconUrl={selectedToken?.icon}
        chainName={fromChain?.name}
        amount={!!sendValue ? `- ${sendValue}` : ''}
        tokenSymbol={selectedToken?.symbol ?? ''}
        isLongText={isLongFromAmount || isLongToAmount}
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
        amount={!!receiveAmt ? `+ ${receiveAmt}` : ''}
        tokenSymbol={toTokenInfo?.symbol ?? ''}
        isLongText={isLongFromAmount || isLongToAmount}
      />
      <WarningMessage
        text={
          <span>
            {!isNative ? (
              <>
                <span style={{ marginRight: '2px' }}>
                  {formatMessage({ id: 'transfer.warning.confirm.to.address' })}
                </span>
                {toTokenAddress ? (
                  <Link
                    isExternal
                    href={formatTokenUrl(toChain?.tokenUrlPattern, toTokenAddress)}
                    display="inline-block"
                    overflowWrap={'break-word'}
                    pointerEvents={'all'}
                    color="currentColor"
                  >
                    {isBase
                      ? formatAppAddress({ address: toTokenAddress, isTruncated: true })
                      : toTokenAddress}
                  </Link>
                ) : null}
              </>
            ) : (
              <>
                <span style={{ marginRight: '2px' }}>
                  {formatMessage({ id: 'transfer.warning.confirm.to.native.token.address' })}
                </span>
                <span>{getToTokenSymbol()?.[bridgeType]?.toUpperCase() ?? ''}</span>
              </>
            )}
          </span>
        }
      />
    </Flex>
  );
};
