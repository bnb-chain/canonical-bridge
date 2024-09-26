import { Box, useColorMode, useIntl, useTheme } from '@bnb-chain/space';

import { FeesIcon } from '@/core/components/icons/FeesIcon';
import { FeeBreakdown } from '@/modules/transfer/components/TransferOverview/RouteInfo/FeeBreakdown';
import { InfoTooltip } from '@/core/components/InfoTooltip';

interface FeesInfoProps {
  summary?: string;
  breakdown?: { label: string; value: string }[];
  bridgeType?: string;
}

export const FeesInfo = ({ summary, breakdown, bridgeType }: FeesInfoProps) => {
  const theme = useTheme();
  const { colorMode } = useColorMode();
  const { formatMessage } = useIntl();
  return (
    <Box color={theme.colors[colorMode].text.tertiary} display={'inline-block'} lineHeight={'16px'}>
      <FeesIcon w={'16px'} h={'16px'} mr={'4px'} />
      <Box
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
        mr={'4px'}
        as="span"
        display={'inline'}
        fontSize="14px"
        lineHeight={'16px'}
        fontWeight={500}
      >
        {summary}
      </Box>
      <InfoTooltip
        label={
          breakdown && breakdown?.length > 0
            ? breakdown.map((fee, index) => {
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
