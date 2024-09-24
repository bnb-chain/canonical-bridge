import { Box, Tooltip, useColorMode, useIntl, useTheme } from '@bnb-chain/space';
import { InfoCircleIcon } from '@bnb-chain/icons';

import { FeesIcon } from '@/core/components/icons/FeesIcon';
import { FeeBreakdown } from '@/modules/transfer/components/TransferOverview/RouteInfo/FeeBreakdown';

interface FeesInfoProps {
  summary?: string;
  breakdown?: { label: string; value: string }[];
  bridgeType?: string;
}

export const FeesInfo = ({ summary, breakdown, bridgeType }: FeesInfoProps) => {
  const theme = useTheme();
  const { colorMode } = useColorMode();
  const { formatMessage } = useIntl();
  return summary !== '--' ? (
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
      <Tooltip
        hasArrow
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
        placement={'top'}
      >
        <InfoCircleIcon display={'inline'} w={'16px'} h={'16px'} />
      </Tooltip>
    </Box>
  ) : null;
};
