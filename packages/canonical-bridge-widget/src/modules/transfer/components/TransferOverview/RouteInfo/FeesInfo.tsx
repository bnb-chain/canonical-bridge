import { Box, useColorMode, useIntl, useTheme } from '@bnb-chain/space';
import { useMemo } from 'react';

import { FeesIcon } from '@/core/components/icons/FeesIcon';
import { FeeBreakdown } from '@/modules/transfer/components/TransferOverview/RouteInfo/FeeBreakdown';
import { InfoTooltip } from '@/core/components/InfoTooltip';
import { useAppSelector } from '@/modules/store/StoreProvider';

interface FeesInfoProps {
  bridgeType?: string;
  isError?: boolean;
}

export const FeesInfo = ({ bridgeType, isError }: FeesInfoProps) => {
  const theme = useTheme();
  const { colorMode } = useColorMode();
  const { formatMessage } = useIntl();

  const routeFees = useAppSelector((state) => state.transfer.routeFees);

  const feeDetails = useMemo(() => {
    let feeContent = '';
    const feeBreakdown = [];
    if (bridgeType === 'cBridge' && routeFees?.['cBridge']) {
      feeContent = routeFees?.['cBridge'].summary;
      feeBreakdown.push(...routeFees?.['cBridge'].breakdown);
    } else if (bridgeType === 'deBridge' && routeFees?.['deBridge']) {
      feeContent = routeFees?.['deBridge'].summary;
      feeBreakdown.push(...routeFees?.['deBridge'].breakdown);
    } else if (bridgeType === 'stargate' && routeFees?.['stargate']) {
      feeContent = routeFees?.['stargate'].summary;
      feeBreakdown.push(...routeFees?.['stargate'].breakdown);
    } else if (bridgeType === 'layerZero' && routeFees?.['layerZero']) {
      feeContent = routeFees?.['layerZero'].summary;
      feeBreakdown.push(...routeFees?.['layerZero'].breakdown);
    } else if (bridgeType === 'meson' && routeFees?.['meson']) {
      feeContent = routeFees?.['meson'].summary;
      feeBreakdown.push(...routeFees?.['meson'].breakdown);
    }
    return { summary: feeContent ? feeContent : '--', breakdown: feeBreakdown };
  }, [bridgeType, routeFees]);
  return (
    <Box
      className="bccb-widget-route-fee-info"
      color={theme.colors[colorMode].text.tertiary}
      display={'inline-block'}
      lineHeight={'16px'}
      opacity={isError ? 0.5 : 1}
      sx={{
        '>svg': {
          verticalAlign: '-3px',
        },
      }}
    >
      <FeesIcon w={'16px'} h={'16px'} mr={'4px'} />
      <Box
        className="bccb-widget-route-info-label"
        mr={'4px'}
        as="span"
        display={'inline'}
        fontSize={'14px'}
        lineHeight={'16px'}
        fontWeight={400}
      >
        {formatMessage({ id: 'route.fees.title' })}
      </Box>
      <Box
        className="bccb-widget-route-info-text"
        mr={'4px'}
        as="span"
        display={'inline'}
        fontSize="14px"
        lineHeight={'16px'}
        fontWeight={500}
      >
        {feeDetails.summary}
      </Box>
      <InfoTooltip
        label={
          feeDetails.breakdown && feeDetails.breakdown?.length > 0
            ? feeDetails.breakdown.map((fee, index) => {
                return fee.value !== '0' && fee.value !== null ? (
                  <FeeBreakdown
                    key={`${bridgeType}-${index}-fee`}
                    title={fee.label}
                    value={fee.value}
                  />
                ) : null;
              })
            : null
        }
      />
    </Box>
  );
};
