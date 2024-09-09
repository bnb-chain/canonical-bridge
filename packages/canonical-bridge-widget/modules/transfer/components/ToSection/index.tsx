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
import { setToChain } from '@/modules/transfer/action';
import { BridgeChain, formatTokenUrl } from '@/modules/bridges';
import { ExternalAddress } from '@/modules/transfer/components/ExternalTokenAddress';
import { formatNumber } from '@/core/utils/number';
import { useToTokenDisplayedInfo } from '@/modules/transfer/hooks/useToTokenDisplayedInfo';
import { useSetSelectInfo } from '@/modules/transfer/hooks/useSetSelectInfo';
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

  const onSelectSource = (chain: BridgeChain) => {
    setSelectInfo({
      direction: 'to',
      toChainId: chain.id,
    });

    dispatch(setToChain(chain));
  };
  const isGlobalFeeLoading = useAppSelector((state) => state.transfer.isGlobalFeeLoading);

  const { getSortedReceiveAmount } = useGetReceiveAmount();

  const receiveAmt = useMemo(() => {
    if (transferActionInfo && transferActionInfo.bridgeType) {
      const bridgeType = transferActionInfo.bridgeType;
      const receiveValue = getSortedReceiveAmount();
      return receiveValue[bridgeType];
    }
    return null;
  }, [getSortedReceiveAmount, transferActionInfo]);

  const bridgeType = transferActionInfo?.bridgeType;
  const tokenAddress = (bridgeType && getToTokenAddress()?.[bridgeType]) || '';

  return (
    <>
      <Flex flexDir="column" gap={'12px'} mt={`-${'20px'}`}>
        <Flex alignItems="center" justifyContent={'space-between'}>
          <Typography
            variant="body"
            lineHeight={'16px'}
            size={'sm'}
            color={theme.colors[colorMode].text.placeholder}
          >
            {formatMessage({ id: 'to.section.title' })}
          </Typography>
          {tokenAddress && toChain && (
            <ExternalAddress
              address={tokenAddress}
              tokenUrl={formatTokenUrl(toChain?.tokenUrlPattern, tokenAddress)}
            />
          )}
        </Flex>

        <Flex
          flexDir="column"
          justifyContent="space-between"
          borderRadius={'16px'}
          border={`1px solid ${theme.colors[colorMode].border['3']}`}
          p={'8px'}
          gap={'8px'}
        >
          <Flex gap={'24px'}>
            <SelectButton network={toChain} token={toTokenDisplayedInfo} onClick={onOpen} />

            <Flex flex={1} flexDir={'column'} alignItems={'flex-start'} justifyContent={'center'}>
              <Input
                disabled={true}
                color={theme.colors[colorMode].text.secondary}
                fontSize={'24px'}
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
                  fontSize={'12px'}
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
