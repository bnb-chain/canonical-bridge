import { Box, Flex, Image, useIntl } from '@bnb-chain/space';
import React from 'react';
import { BridgeType } from '@bnb-chain/canonical-bridge-sdk';

import { StarGateLogo } from '@/core/components/icons/brand/StargateLogo';
import { CBridgeIcon } from '@/core/components/icons/brand/CBridgeLogo';
import { env } from '@/core/configs/env';

export const RouteName = React.memo(({ bridgeType }: { bridgeType?: BridgeType }) => {
  const { formatMessage } = useIntl();
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
    </Flex>
  );
});

RouteName.displayName = 'RouteName';
