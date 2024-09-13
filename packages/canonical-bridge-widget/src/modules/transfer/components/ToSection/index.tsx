import {
  Flex,
  Typography,
  theme,
  useBreakpointValue,
  useColorMode,
  useDisclosure,
  useIntl,
} from '@bnb-chain/space';

import { SelectButton } from '@/modules/transfer/components/SelectButton';
import { SelectDestinationModal } from '@/modules/transfer/components/SelectModal/SelectDestinationModal';
import { useAppDispatch, useAppSelector } from '@/modules/store/StoreProvider';
import { setToChain } from '@/modules/transfer/action';
import { BridgeChain } from '@/modules/bridges';
import { useSetSelectInfo } from '@/modules/transfer/hooks/useSetSelectInfo';

export function ToSection() {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { formatMessage } = useIntl();
  const dispatch = useAppDispatch();
  const { setSelectInfo } = useSetSelectInfo();
  const isBase = useBreakpointValue({ base: true, md: false }) ?? false;

  const toChain = useAppSelector((state) => state.transfer.toChain);

  // const { getToTokenAddress } = useToTokenInfo();
  const { colorMode } = useColorMode();

  const onSelectSource = (chain: BridgeChain) => {
    setSelectInfo({
      direction: 'to',
      toChainId: chain.id,
    });

    dispatch(setToChain(chain));
  };

  // const { getSortedReceiveAmount } = useGetReceiveAmount();

  // const receiveAmt = useMemo(() => {
  //   if (transferActionInfo && transferActionInfo.bridgeType) {
  //     const bridgeType = transferActionInfo.bridgeType;
  //     const receiveValue = getSortedReceiveAmount();
  //     return receiveValue[bridgeType];
  //   }
  //   return null;
  // }, [getSortedReceiveAmount, transferActionInfo]);

  // const bridgeType = transferActionInfo?.bridgeType;
  // const tokenAddress = (bridgeType && getToTokenAddress()?.[bridgeType]) || '';

  return (
    <>
      <Flex flexDir="column" gap={'12px'} w={'100%'} flex={1} h={'64px'}>
        {isBase ? (
          <Flex alignItems="center" justifyContent={'space-between'}>
            <Typography
              variant="body"
              lineHeight={'16px'}
              size={'sm'}
              color={theme.colors[colorMode].text.placeholder}
            >
              {formatMessage({ id: 'to.section.title' })}
            </Typography>
          </Flex>
        ) : null}
        <Flex
          flexDir="column"
          justifyContent="space-between"
          borderRadius={'8px'}
          border={`1px solid ${theme.colors[colorMode].border['3']}`}
        >
          <SelectButton network={toChain} onClick={onOpen} />

          {/* <Flex flex={1} flexDir={'column'} alignItems={'flex-start'} justifyContent={'center'}>
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
            </Flex> */}
        </Flex>
      </Flex>

      <SelectDestinationModal isOpen={isOpen} onClose={onClose} onSelect={onSelectSource} />
    </>
  );
}
