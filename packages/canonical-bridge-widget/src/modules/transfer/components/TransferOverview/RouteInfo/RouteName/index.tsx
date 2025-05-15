import { Box, Flex, Image, useIntl } from '@bnb-chain/space';
import React from 'react';
import { BridgeType } from '@bnb-chain/canonical-bridge-sdk';

import { StarGateLogo } from '@/core/components/icons/brand/StargateLogo';
import { CBridgeIcon } from '@/core/components/icons/brand/CBridgeLogo';
import { useGetReceiveAmount } from '@/modules/transfer/hooks/useGetReceiveAmount';
import { useGetBestTime } from '@/modules/transfer/hooks/useGetBestTime';
import { getMaxValueKey } from '@/core/utils/number';
import { BestRouteTag } from '@/modules/transfer/components/TransferOverview/RouteInfo/RouteName/BestRouteTag';
import { useBridgeConfig } from '@/CanonicalBridgeProvider';
import { RedeemRatio } from '@/modules/transfer/components/TransferOverview/RouteInfo/RouteName/RedeemRatio.tsx';

interface RouteNameProps {
  bridgeType?: BridgeType;
  isReceiveSection?: boolean;
  isError?: boolean;
  receiveAmt?: string;
}

export const RouteName = React.memo(
  ({ bridgeType, isReceiveSection = false, isError, receiveAmt }: RouteNameProps) => {
    const { formatMessage } = useIntl();
    const { getSortedReceiveAmount } = useGetReceiveAmount();
    const bridgeConfig = useBridgeConfig();

    const receiveValue = getSortedReceiveAmount();
    const bestTimeRoute = useGetBestTime();
    const bestReturnRoute = getMaxValueKey(receiveValue);

    return (
      <Flex
        className="bccb-widget-route-name"
        minH={'24px'}
        flexDir={'row'}
        gap={'4px 8px'}
        alignItems={'center'}
        opacity={isError ? 0.5 : 1}
        flexWrap={'wrap'}
        whiteSpace={'nowrap'}
        mb={isReceiveSection ? '4px' : 0}
      >
        {bridgeType === 'cBridge' ? (
          <CBridgeIcon w={['16px', '16px', '16px', '20px']} h={['16px', '16px', '16px', '20px']} />
        ) : bridgeType === 'deBridge' ? (
          <Image
            src={`${bridgeConfig.assetPrefix}/images/debridgeIcon.png`}
            alt="deBridge"
            w={['16px', '16px', '16px', '20px']}
            h={['16px', '16px', '16px', '20px']}
            borderRadius={'100%'}
          />
        ) : bridgeType === 'stargate' ? (
          <StarGateLogo w={['16px', '16px', '16px', '20px']} h={['16px', '16px', '16px', '20px']} />
        ) : bridgeType === 'layerZero' ? (
          <Image
            src={`${bridgeConfig.assetPrefix}/images/layerZeroIcon.png`}
            alt="layerZero"
            w={['16px', '16px', '16px', '20px']}
            h={['16px', '16px', '16px', '20px']}
            borderRadius={'100%'}
          />
        ) : bridgeType === 'meson' ? (
          <Image
            src={`${bridgeConfig.assetPrefix}/images/mesonIcon.png`}
            alt="meson"
            w={['16px', '16px', '16px', '20px']}
            h={['16px', '16px', '16px', '20px']}
            borderRadius={'100%'}
          />
        ) : null}

        <Flex
          justifyContent={[
            isReceiveSection ? 'flex-start' : 'space-between',
            isReceiveSection ? 'flex-start' : 'space-between',
            isReceiveSection ? 'flex-start' : 'space-between',
            'space-between',
          ]}
          gap={'8px'}
          alignItems={'center'}
          flex={[0, 0, 0, 1]}
        >
          <Box
            className="bccb-widget-route-name-text"
            fontSize={['12px', '12px', '12px', '14px']}
            lineHeight={['16px', '16px', '16px', '20px']}
            fontWeight={500}
          >
            {bridgeType === 'cBridge'
              ? formatMessage({ id: 'route.option.cBridge.title' })
              : bridgeType === 'deBridge'
              ? formatMessage({ id: 'route.option.deBridge.title' })
              : bridgeType === 'stargate'
              ? formatMessage({ id: 'route.option.stargate.title' })
              : bridgeType === 'layerZero'
              ? formatMessage({ id: 'route.option.layerZero.title' })
              : bridgeType === 'meson'
              ? formatMessage({ id: 'route.option.meson.title' })
              : null}
          </Box>
        </Flex>
        <Flex gap={'4px'} pr={['48px', '48px', 0]}>
          {bridgeType === bestTimeRoute && <BestRouteTag bestMode={'bestTime'} />}
          {bridgeType === bestReturnRoute && <BestRouteTag bestMode={'bestReturn'} />}
          {!(isError && receiveAmt === '--') && <RedeemRatio bridgeType={bridgeType} />}
        </Flex>
      </Flex>
    );
  },
);

RouteName.displayName = 'RouteName';
