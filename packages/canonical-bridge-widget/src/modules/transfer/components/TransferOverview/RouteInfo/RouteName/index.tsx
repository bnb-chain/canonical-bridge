import { Box, Flex, Image, useIntl } from '@bnb-chain/space';
import React from 'react';
import { BridgeType } from '@bnb-chain/canonical-bridge-sdk';

import { StarGateLogo } from '@/core/components/icons/brand/StargateLogo';
import { CBridgeIcon } from '@/core/components/icons/brand/CBridgeLogo';
import { env } from '@/core/configs/env';
import { useGetReceiveAmount } from '@/modules/transfer/hooks/useGetReceiveAmount';
import { useGetBestTime } from '@/modules/transfer/hooks/useGetBestTime';
import { getMaxValueKey } from '@/core/utils/number';
import { BestRouteTag } from '@/modules/transfer/components/TransferOverview/RouteInfo/RouteName/BestRouteTag';

export const RouteName = React.memo(({ bridgeType }: { bridgeType?: BridgeType }) => {
  const { formatMessage } = useIntl();
  const { getSortedReceiveAmount } = useGetReceiveAmount();

  const receiveValue = getSortedReceiveAmount();
  const bestTimeRoute = useGetBestTime();
  const bestReturnRoute = getMaxValueKey(receiveValue);
  return (
    <Flex flexDir={'row'} gap={'8px'}>
      {bridgeType === 'cBridge' ? (
        <CBridgeIcon w={'20px'} h={'20px'} />
      ) : bridgeType === 'deBridge' ? (
        <Image
          src={`${env.ASSET_PREFIX}/images/debridgeIcon.png`}
          alt="deBridge"
          w={'20px'}
          h={'20px'}
          borderRadius={'100%'}
        />
      ) : bridgeType === 'stargate' ? (
        <StarGateLogo w={'20px'} h={'20px'} />
      ) : bridgeType === 'layerZero' ? (
        <Image
          src={`${env.ASSET_PREFIX}/images/layerZeroIcon.png`}
          alt="layerZero"
          w={'20px'}
          h={'20px'}
          borderRadius={'100%'}
        />
      ) : null}

      <Flex justifyContent={'space-between'} alignItems={'center'} flex={1}>
        <Box fontSize={'14px'} fontWeight={500} lineHeight={'20px'}>
          {bridgeType === 'cBridge'
            ? formatMessage({ id: 'route.option.cBridge.title' })
            : bridgeType === 'deBridge'
            ? formatMessage({ id: 'route.option.deBridge.title' })
            : bridgeType === 'stargate'
            ? formatMessage({ id: 'route.option.stargate.title' })
            : bridgeType === 'layerZero'
            ? formatMessage({ id: 'route.option.layerZero.title' })
            : null}
        </Box>
        <Flex gap={'4px'}>
          {bridgeType === bestTimeRoute && <BestRouteTag bestMode={'bestTime'} />}
          {bridgeType === bestReturnRoute && <BestRouteTag bestMode={'bestReturn'} />}
        </Flex>
      </Flex>
    </Flex>
  );
});

RouteName.displayName = 'RouteName';
