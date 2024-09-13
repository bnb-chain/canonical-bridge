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
    <Flex alignItems="flex-start" flexDir={'column'} h={'32px'} mb={'4px'}>
      <Flex
        color={theme.colors[colorMode].text.tertiary}
        fontSize={'12px'}
        fontWeight={400}
        whiteSpace={'nowrap'}
        h={'16px'}
      >
        {label}
      </Flex>
      {isLoading ? (
        <LoadingSvg />
      ) : (
        <Flex
          whiteSpace={'nowrap'}
          fontSize={'14px'}
          fontWeight={500}
          h={'16px'}
          color={theme.colors[colorMode].text.secondary}
        >
          {value}
        </Flex>
      )}
    </Flex>
  );
}
