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
import { BridgeChain, useSetSelectInfo } from '@/modules/bridges/main';
import { setToChain } from '@/modules/transfer/action';
import { ExternalAddress } from '@/modules/transfer/components/ExternalTokenAddress';
import { formatNumber } from '@/core/utils/number';
import { useToTokenDisplayedInfo } from '@/modules/transfer/hooks/useToTokenDisplayedInfo';

export function ToSection() {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { formatMessage } = useIntl();
  const dispatch = useAppDispatch();
  const { setSelectInfo } = useSetSelectInfo();

  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const toChain = useAppSelector((state) => state.transfer.toChain);
  const receiveValue = useAppSelector((state) => state.transfer.receiveValue);
  const transferActionInfo = useAppSelector((state) => state.transfer.transferActionInfo);

  const { toTokenInfo, getToDecimals, getToTokenAddress } = useToTokenInfo();
  const { colorMode } = useColorMode();
  const toTokenDisplayedInfo = useToTokenDisplayedInfo();

  const onSelectSource = (chain: BridgeChain) => {
    setSelectInfo({
      direction: 'to',
      toChainId: chain.id,
    });

    dispatch(setToChain(chain));
  };
  const isGlobalFeeLoading = useAppSelector((state) => state.transfer.isGlobalFeeLoading);

  const receiveAmt = useMemo(() => {
    if (receiveValue && transferActionInfo && transferActionInfo.bridgeType) {
      const bridgeType = transferActionInfo.bridgeType;
      return receiveValue[bridgeType];
    }
    return null;
  }, [receiveValue, transferActionInfo]);

  const bridgeType = transferActionInfo?.bridgeType;
  const tokenAddress = (bridgeType && getToTokenAddress()?.[bridgeType]) || '';

  return (
    <>
      <Flex flexDir="column" gap={theme.sizes['3']} mt={`-${theme.sizes['5']}`}>
        <Flex alignItems="center" justifyContent={'space-between'}>
          <Typography
            variant="body"
            lineHeight={theme.sizes['4']}
            size={'sm'}
            color={theme.colors[colorMode].text.placeholder}
          >
            {formatMessage({ id: 'to.section.title' })}
          </Typography>
          {tokenAddress && toChain && (
            <ExternalAddress address={tokenAddress} chain_id={toChain.id} />
          )}
        </Flex>

        <Flex
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
      </Flex>

      <SelectDestinationModal isOpen={isOpen} onClose={onClose} onSelect={onSelectSource} />
    </>
  );
}
