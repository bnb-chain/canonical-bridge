import { Box, Flex, Skeleton, useColorMode, useTheme } from '@bnb-chain/space';
import { useMemo } from 'react';

import { FeesInfo } from '@/modules/transfer/components/TransferOverview/RouteInfo/FeesInfo';
import { useAppSelector } from '@/modules/store/StoreProvider';
import { EstimatedArrivalTime } from '@/modules/transfer/components/TransferOverview/RouteInfo/EstimatedArrivalTime';

export const FeeSummary = () => {
  const theme = useTheme();
  const { colorMode } = useColorMode();
  const transferActionInfo = useAppSelector((state) => state.transfer.transferActionInfo);
  const isGlobalFeeLoading = useAppSelector((state) => state.transfer.isGlobalFeeLoading);
  const bridgeType = useMemo(() => transferActionInfo?.bridgeType, [transferActionInfo]);

  return (
    <Box mt={'8px'} p={'12px'} borderRadius={'8px'} bg={theme.colors[colorMode].background.modal}>
      {isGlobalFeeLoading ? (
        <Flex flexDir={'column'} gap={'8px'}>
          <Skeleton height="12px" maxW="333px" w={'100%'} borderRadius={'4px'} />
          <Skeleton height="12px" maxW="371px" w={'100%'} borderRadius={'4px'} />
        </Flex>
      ) : (
        <>
          <FeesInfo bridgeType={bridgeType} />
          <EstimatedArrivalTime bridgeType={bridgeType} />
        </>
      )}
    </Box>
  );
};
