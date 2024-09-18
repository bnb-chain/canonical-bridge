import { Box, BoxProps, Flex, useColorMode, useIntl, useTheme } from '@bnb-chain/space';
import { useEffect, useState } from 'react';
import { formatUnits } from 'viem';
import { useAccount, useBalance } from 'wagmi';
import { WarningTriangleIcon } from '@bnb-chain/icons';

import { formatNumber } from '@/core/utils/number';
import { useAppDispatch, useAppSelector } from '@/modules/store/StoreProvider';
import { useGetTokenBalance } from '@/core/contract/hooks/useGetTokenBalance';
import { DEBOUNCE_DELAY } from '@/core/constants';
import { useDebounce } from '@/core/hooks/useDebounce';
import { setError, setIsTransferable, setSendValue } from '@/modules/transfer/action';
import { useCBridgeSendMaxMin } from '@/modules/aggregator/adapters/cBridge/hooks/useCBridgeSendMaxMin';
import { IBridgeToken } from '@/modules/aggregator/types';
import { ICBridgeMaxMinSendAmt } from '@/modules/aggregator/adapters/cBridge/types';
import { ITransferActionInfo } from '@/modules/transfer/types';

export const TokenBalance = () => {
  const { address, chain } = useAccount();
  const { data: nativeBalance } = useBalance({ address: address as `0x${string}` });

  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const sendValue = useAppSelector((state) => state.transfer.sendValue);
  const transferActionInfo = useAppSelector((state) => state.transfer.transferActionInfo);
  const error = useAppSelector((state) => state.transfer.error);
  const estimatedAmount = useAppSelector((state) => state.transfer.estimatedAmount);

  const debouncedSendValue = useDebounce(sendValue, DEBOUNCE_DELAY);
  const dispatch = useAppDispatch();
  const { minMaxSendAmt } = useCBridgeSendMaxMin();
  const { balance: initBalance, refetch } = useGetTokenBalance({
    tokenAddress: selectedToken?.address as `0x${string}`,
  });
  const [balance, setBalance] = useState<bigint | null>(null);

  const setMaxAmount = () => {
    if (balance && selectedToken) {
      dispatch(setSendValue(formatUnits(balance, selectedToken?.decimals || 0)));
    }
  };
  useEffect(() => {
    if (typeof initBalance === 'bigint') {
      setBalance(initBalance);
    } else if (!selectedToken) {
      setBalance(0n);
    } else {
      setBalance(0n);
    }
  }, [initBalance, selectedToken]);

  useEffect(() => {
    let mount = true;
    if (!mount) return;
    try {
      const inter = setInterval(async () => {
        if (!address || !selectedToken || chain?.id !== fromChain?.id) {
          return;
        }
        refetch({
          cancelRefetch: !address || !selectedToken || chain?.id !== fromChain?.id,
        })
          .then(({ data: balance }) => {
            if (typeof balance === 'bigint') {
              setBalance(balance);
            }
          })
          .catch(() => {});
      }, 10000);
      return () => {
        mount = false;
        inter && clearInterval(inter);
      };
    } catch (e: any) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
  }, [refetch, address, selectedToken, fromChain, chain, initBalance]);

  useEffect(() => {
    const balanceResult = getBalanceComponent({
      balance,
      decimal: selectedToken?.decimals || 0,
      minMaxSendAmt,
      value: Number(debouncedSendValue),
      isConnected: !!chain,
      transferActionInfo,
      isPegged: selectedToken?.isPegged,
      estimatedAmount: estimatedAmount,
      nativeBalance,
    });
    if (balanceResult?.isError === true) {
      dispatch(setIsTransferable(false));
      dispatch(setError(balanceResult.text));
    } else {
      dispatch(setError(undefined));
      dispatch(setIsTransferable(true));
    }
  }, [
    balance,
    chain,
    debouncedSendValue,
    dispatch,
    estimatedAmount,
    minMaxSendAmt,
    nativeBalance,
    selectedToken?.decimals,
    selectedToken?.isPegged,
    transferActionInfo,
  ]);

  return balance !== null && selectedToken && chain ? (
    <StyledTokenBalance
      error={error}
      balance={balance}
      selectedToken={selectedToken}
      setMaxAmount={setMaxAmount}
    />
  ) : null;
};

export interface StyledTokenBalanceInfoProps {
  error?: string;
  balance: bigint;
  selectedToken: IBridgeToken;
  setMaxAmount: () => void;
}

export function StyledTokenBalance(props: StyledTokenBalanceInfoProps) {
  const { error, balance, selectedToken, setMaxAmount } = props;
  const { colorMode } = useColorMode();
  const { formatMessage } = useIntl();
  const theme = useTheme();

  return (
    <Flex flex={1} flexDir={'column'} fontSize={'12px'}>
      <Flex gap={'8px'}>
        <Flex color={theme.colors[colorMode].text.tertiary} flexDir={'row'} alignItems={'center'}>
          {error ? (
            <WarningTriangleIcon
              w={'16px'}
              h={'16px'}
              mr={'4px'}
              color={theme.colors[colorMode].text.danger}
            />
          ) : null}
          {formatMessage({ id: 'from.section.balance.title' })}
          <Box ml={'4px'} color={theme.colors[colorMode].text.secondary} fontWeight={500}>
            {Number(formatUnits(balance, selectedToken?.decimals))}
          </Box>
        </Flex>
        {!!balance ? (
          <Box
            onClick={setMaxAmount}
            color={theme.colors[colorMode].button.brand.default}
            cursor={'pointer'}
            fontSize={'14px'}
            fontWeight={500}
            pb={`1px`}
          >
            {formatMessage({ id: 'from.section.balance.button.max' })}
          </Box>
        ) : null}
      </Flex>
    </Flex>
  );
}

export const getBalanceComponent = ({
  balance,
  decimal,
  minMaxSendAmt,
  value,
  isConnected,
  transferActionInfo,
  isPegged = false,
  estimatedAmount,
  nativeBalance,
}: {
  balance: null | bigint;
  decimal: number;
  minMaxSendAmt: ICBridgeMaxMinSendAmt;
  value: number;
  isConnected: boolean;
  transferActionInfo: ITransferActionInfo | undefined;
  isPegged?: boolean;
  estimatedAmount?: any;
  nativeBalance: any;
}) => {
  try {
    if (!decimal || !value) {
      return null;
    }
    if (estimatedAmount?.stargate && transferActionInfo?.bridgeType === 'stargate' && value) {
      const stargateMax = formatUnits(estimatedAmount.stargate[0].maxAmountLD, decimal);
      if (value > Number(stargateMax)) {
        return {
          text: `The amount should be less than ${formatNumber(Number(stargateMax))}.`,
          isError: true,
        };
      }
    }
    if (
      estimatedAmount?.deBridge &&
      transferActionInfo?.bridgeType === 'deBridge' &&
      nativeBalance &&
      value
    ) {
      const deBridgeProtocolFee = estimatedAmount.deBridge?.fixFee;
      if (BigInt(deBridgeProtocolFee) > nativeBalance.value) {
        return { text: `Your balance can not cover protocol fee.`, isError: true };
      }
    }
    const maxAmt = Number(formatUnits(minMaxSendAmt.max, decimal));
    const minAmt = Number(formatUnits(minMaxSendAmt.min, decimal));

    if (!isConnected && maxAmt > 0 && minAmt > 0) {
      if (transferActionInfo?.bridgeType === 'cBridge' && !isPegged) {
        if (value <= minAmt) {
          return { text: `The amount should be greater than ${minAmt}.`, isError: true };
        } else if (value >= maxAmt) {
          return { text: `The amount should be less than ${maxAmt}.`, isError: true };
        }
      }
      return { text: '', isError: false };
    } else if (balance) {
      if (value > Number(formatUnits(balance, decimal))) {
        return { text: `You have insufficient balance`, isError: true };
      } else if (value <= minAmt && transferActionInfo?.bridgeType === 'cBridge' && !isPegged) {
        return { text: `The amount should be greater than ${minAmt}.`, isError: true };
      } else if (value >= maxAmt && transferActionInfo?.bridgeType === 'cBridge' && !isPegged) {
        return { text: `The amount should be less than ${maxAmt}.`, isError: true };
      }
      return { text: `${formatNumber(Number(formatUnits(balance, decimal)))}`, isError: false };
    } else {
      return { isError: true, text: 'You have insufficient balance' };
    }
  } catch (e: any) {
    // eslint-disable-next-line no-console
    console.log(e);
  }
};

export function ErrorMsg(props: BoxProps) {
  const { colorMode } = useColorMode();
  const theme = useTheme();

  return (
    <Box
      color={theme.colors[colorMode].text.danger}
      fontSize={'12px'}
      fontWeight={400}
      lineHeight={'16px'}
      {...props}
    />
  );
}
