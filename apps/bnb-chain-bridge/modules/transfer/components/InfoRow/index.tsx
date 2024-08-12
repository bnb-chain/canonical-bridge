import { Flex, theme, useColorMode } from '@bnb-chain/space';

import { LoadingSvg } from '../LoadingImg';

interface InfoRowProps {
  label: React.ReactNode;
  value: React.ReactNode;
  isLoading?: boolean;
}

export function InfoRow(props: InfoRowProps) {
  const { label, value, isLoading } = props;
  const { colorMode } = useColorMode();
  return (
    <Flex alignItems="flex-start" flexDir={'column'} h={theme.sizes['8']} mb={theme.sizes['1']}>
      <Flex
        color={theme.colors[colorMode].text.tertiary}
        fontSize={theme.sizes['3']}
        fontWeight={400}
        whiteSpace={'nowrap'}
        h={theme.sizes['4']}
      >
        {label}
      </Flex>
      {isLoading ? (
        <LoadingSvg />
      ) : (
        <Flex
          whiteSpace={'nowrap'}
          fontSize={theme.sizes['3.5']}
          fontWeight={500}
          h={theme.sizes['4']}
          color={theme.colors[colorMode].text.secondary}
        >
          {value}
        </Flex>
      )}
    </Flex>
  );
}
