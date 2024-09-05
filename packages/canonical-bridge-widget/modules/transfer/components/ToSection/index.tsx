import {
  Box,
  Flex,
  Input,
  Typography,
  theme,
  useColorMode,
  useDisclosure,
  useIntl,
} from '@bnb-chain/space';
import { formatUnits } from 'viem';
import { useMemo } from 'react';

import { useToTokenInfo } from '@/modules/transfer/hooks/useToTokenInfo';
import { SelectButton } from '@/modules/transfer/components/SelectButton';
import { SelectDestinationModal } from '@/modules/transfer/components/SelectModal/SelectDestinationModal';
import { useAppDispatch, useAppSelector } from '@/core/store/hooks';
import { BridgeChain, formatTokenUrl } from '@/modules/bridges';
import { setToChain } from '@/modules/transfer/action';
import { ExternalAddress } from '@/modules/transfer/components/ExternalTokenAddress';
import { formatNumber } from '@/core/utils/number';
import { useToTokenDisplayedInfo } from '@/modules/transfer/hooks/useToTokenDisplayedInfo';
import { useSetSelectInfo } from '@/modules/transfer/hooks/useSetSelectInfo';
import { ToAccount } from '@/modules/transfer/components/ToAccount';
import { useGetReceiveAmount } from '@/modules/transfer/hooks/useGetReceiveAmount';

export function ToSection() {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { formatMessage } = useIntl();
  const dispatch = useAppDispatch();
  const { setSelectInfo } = useSetSelectInfo();

  const toChain = useAppSelector((state) => state.transfer.toChain);
  const transferActionInfo = useAppSelector((state) => state.transfer.transferActionInfo);

  const { toTokenInfo, getToDecimals, getToTokenAddress } = useToTokenInfo();
  const { colorMode } = useColorMode();
  const toTokenDisplayedInfo = useToTokenDisplayedInfo();
  const { getReceiveAmount } = useGetReceiveAmount();

  const onSelectSource = (chain: BridgeChain) => {
    setSelectInfo({
      direction: 'to',
      toChainId: chain.id,
    });

    dispatch(setToChain(chain));
  };
  const isGlobalFeeLoading = useAppSelector((state) => state.transfer.isGlobalFeeLoading);

  const receiveAmt = useMemo(() => {
    if (transferActionInfo && transferActionInfo.bridgeType) {
      const bridgeType = transferActionInfo.bridgeType;
      return getReceiveAmount(bridgeType);
    }
    return null;
  }, [transferActionInfo, getReceiveAmount]);

  const bridgeType = transferActionInfo?.bridgeType;
  const tokenAddress = (bridgeType && getToTokenAddress()?.[bridgeType]) || '';

  return (
    <>
      <Flex flexDir="column">
        <Flex alignItems="center" justifyContent={'space-between'}>
          <Typography
            variant="body"
            lineHeight={theme.sizes['5']}
            size={'sm'}
            color={theme.colors[colorMode].text.placeholder}
          >
            {formatMessage({ id: 'to.section.title' })}
          </Typography>
          {tokenAddress && (
            <ExternalAddress
              address={tokenAddress}
              tokenUrl={formatTokenUrl(toChain?.tokenUrlPattern, tokenAddress)}
            />
          )}
        </Flex>

        <Flex
          mt={theme.sizes['3']}
          flexDir="column"
          justifyContent="space-between"
          borderRadius={theme.sizes['4']}
          border={`1px solid ${theme.colors[colorMode].border['3']}`}
          p={theme.sizes['2']}
          gap={theme.sizes['2']}
        >
          <Flex gap={theme.sizes['6']}>
            <SelectButton network={toChain} token={toTokenDisplayedInfo} onClick={onOpen} />

            <Flex flex={1} flexDir={'column'} alignItems={'flex-start'} justifyContent={'center'}>
              <Input
                disabled={true}
                color={theme.colors[colorMode].text.secondary}
                fontSize={theme.sizes['6']}
                border={'none'}
                placeholder="0.0"
                _hover={{
                  border: 'none',
                  background: 'none',
                }}
                _focus={{
                  border: 'none',
                  background: 'none',
                }}
                _focusVisible={{
                  border: 'none',
                  background: 'none',
                }}
                _disabled={{
                  border: 'none',
                  background: 'none',
                }}
                px={0}
                background={'none'}
                value={
                  toTokenInfo && receiveAmt && !isGlobalFeeLoading && transferActionInfo?.bridgeType
                    ? `${formatNumber(
                        Number(
                          formatUnits(
                            BigInt(receiveAmt),
                            getToDecimals()[transferActionInfo?.bridgeType],
                          ),
                        ),
                        8,
                      )}`
                    : ''
                }
                readOnly
              />
              {receiveAmt && (
                <Box
                  textAlign={'left'}
                  fontSize={theme.sizes['3']}
                  color={theme.colors[colorMode].text.tertiary}
                >
                  {formatMessage({ id: 'to.section.estimated-amount' })}
                </Box>
              )}
            </Flex>
          </Flex>
        </Flex>

        <ToAccount mt={theme.sizes['6']} />
      </Flex>

      <SelectDestinationModal isOpen={isOpen} onClose={onClose} onSelect={onSelectSource} />
    </>
  );
}
