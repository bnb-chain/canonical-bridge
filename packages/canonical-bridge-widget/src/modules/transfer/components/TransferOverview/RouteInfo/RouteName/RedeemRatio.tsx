import React from 'react';
import { Flex, Typography, useColorMode, useTheme } from '@bnb-chain/space';
import { BridgeType } from '@bnb-chain/canonical-bridge-sdk';

import { useGetReceiveAmount } from '@/modules/transfer/hooks/useGetReceiveAmount';
import { useAppSelector } from '@/modules/store/StoreProvider';
import { UpwardIcon } from '@/core/components/icons/UpwardIcon';
import { DownwardIcon } from '@/core/components/icons/DownwardIcon';

interface RedeemRatioProps {
  bridgeType?: BridgeType;
}

type RatioStatus = 'success' | 'normal' | 'warning' | 'error';

const getRatioStatus = (ratio: number): RatioStatus => {
  if (ratio > 0) return 'success';
  if (ratio < -10) return 'error';
  if (ratio < -5) return 'warning';
  if (ratio < 0) return 'normal';
  return 'success';
};

export const RedeemRatio = React.memo(({ bridgeType }: RedeemRatioProps) => {
  const { colorMode } = useColorMode();
  const theme = useTheme();
  const sendValue = useAppSelector((state) => state.transfer.sendValue);
  const { getSortedReceiveAmount } = useGetReceiveAmount();

  if (!bridgeType || !sendValue) return null;

  const receiveValue = getSortedReceiveAmount();
  const redeemRatio =
    ((receiveValue[bridgeType].value - Number(sendValue)) / Number(sendValue)) * 100;

  // Format redeemRatio based on the requirements
  let formattedRatio: string | null = null;
  const absRatio = Math.abs(redeemRatio);
  if (redeemRatio !== 0) {
    if (absRatio > 1) {
      formattedRatio = `${Math.abs(Math.round(redeemRatio))}%`; // Integer for > 1% or < -1%
    } else if (absRatio >= 0.01) {
      formattedRatio = `${Math.abs(Number(redeemRatio.toFixed(2)))}%`; // Two decimal places for 0.01% to 1%
    } else {
      formattedRatio = `${redeemRatio < 0 ? '-' : ''}0.01%`; // 0.01% or -0.01% for < 0.01% or > -0.01%
    }
  }

  if (formattedRatio === null) return null;

  // Use rounded integer ratio for status calculation
  const status = getRatioStatus(redeemRatio);

  return (
    <Flex
      alignItems="center"
      gap="2px"
      className={`bccb-widget-redeem-ratio bccb-widget-redeem-ratio-${status}`}
      bg={theme.colors[colorMode].ratio[status].bg}
      border={`1px solid ${theme.colors[colorMode].ratio[status].borderColor}`}
      color={theme.colors[colorMode].ratio[status].color}
      padding="3px 7px"
      pr="3px"
      borderRadius="40px"
    >
      <Typography variant="label" size="sm" fontWeight={500}>
        {formattedRatio}
      </Typography>
      {redeemRatio > 0 ? <UpwardIcon /> : <DownwardIcon />}
    </Flex>
  );
});

RedeemRatio.displayName = 'RedeemRatio';
