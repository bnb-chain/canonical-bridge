import { Flex, Skeleton, useColorMode, useTheme } from '@bnb-chain/space';

import { IconImage } from '@/core/components/IconImage';
import { useAppSelector } from '@/modules/store/StoreProvider';

export const TokenInfo = ({
  chainIconUrl,
  tokenIconUrl,
  chainName,
  amount,
  tokenSymbol,
  isLongText,
}: {
  chainIconUrl?: string;
  tokenIconUrl?: string;
  chainName?: string;
  amount?: string;
  tokenSymbol?: string;
  isLongText: boolean;
}) => {
  const isGlobalFeeLoading = useAppSelector((state) => state.transfer.isGlobalFeeLoading);

  return (
    <Flex
      flexDir={'row'}
      justifyContent={'space-between'}
      w={'100%'}
      alignItems={'center'}
      gap={'16px'}
      className="bccb-widget-transaction-summary-modal-token-info"
    >
      <Flex flexShrink={1} flexDir={'row'} alignItems={'center'} gap={'14px'}>
        <Flex
          justifyContent={'center'}
          alignItems={'center'}
          flexShrink={0}
          w={'32px'}
          h={'32px'}
          position={'relative'}
        >
          <IconImage
            position={'absolute'}
            bottom={'-4px'}
            right={'-4px'}
            boxSize="16px"
            src={tokenIconUrl}
            flexShrink={0}
            className="bccb-widget-transaction-summary-modal-token-icon"
          />
          <IconImage
            boxSize="32px"
            src={chainIconUrl}
            flexShrink={0}
            className="bccb-widget-transaction-summary-modal-chain-icon"
          />
        </Flex>
        <Flex
          flexDir={'column'}
          justifyContent={isLongText ? 'flex-start' : 'center'}
          whiteSpace={'wrap'}
          className="bccb-widget-transaction-summary-modal-chain-name"
        >
          <Flex fontSize={'16px'} fontWeight={700}>
            {chainName}
          </Flex>
          {isLongText && !isGlobalFeeLoading && (
            <TokenAmount amount={amount ?? '--'} tokenSymbol={tokenSymbol ?? ''} />
          )}
        </Flex>
      </Flex>
      {!isLongText && !isGlobalFeeLoading && (
        <TokenAmount amount={amount ?? '--'} tokenSymbol={tokenSymbol ?? ''} />
      )}
      {isGlobalFeeLoading && (
        <Skeleton
          className="bccb-widget-transaction-summary-modal-loading-skeleton"
          height="24px"
          maxW="120px"
          w={'100%'}
          borderRadius={'4px'}
        />
      )}
    </Flex>
  );
};

const TokenAmount = ({ amount, tokenSymbol }: { amount: string; tokenSymbol: string }) => {
  const { colorMode } = useColorMode();
  const theme = useTheme();
  return (
    <Flex
      flex={1}
      wordBreak={'break-all'}
      alignItems={'center'}
      justifyContent={'flex-end'}
      fontSize={'14px'}
      lineHeight={'14px'}
      fontWeight={700}
      className="bccb-widget-transaction-summary-modal-token-amount"
      color={
        Number(amount?.replace(' ', '')) < 0
          ? theme.colors[colorMode].support.danger[3]
          : theme.colors[colorMode].support.success[3]
      }
    >
      {amount} {tokenSymbol}
    </Flex>
  );
};
