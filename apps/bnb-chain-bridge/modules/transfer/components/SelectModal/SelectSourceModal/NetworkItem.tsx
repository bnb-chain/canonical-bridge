import { FlexProps, useColorMode, Flex, theme } from '@bnb-chain/space';

import { IconImage } from '@/core/components/IconImage';
import { BridgeChain } from '@/modules/bridges/main';

interface NetworkItemProps extends FlexProps {
  data: BridgeChain;
  isSelected?: boolean;
}

export function NetworkItem(props: NetworkItemProps) {
  const { data, isSelected = false, ...restProps } = props;

  const { colorMode } = useColorMode();

  return (
    <Flex
      alignItems="center"
      px={theme.sizes['3']}
      gap={theme.sizes['2']}
      borderRadius={theme.sizes['2']}
      border="1px solid"
      borderColor={
        isSelected ? theme.colors[colorMode].support.brand[3] : theme.colors[colorMode].border[3]
      }
      _hover={{
        bg: isSelected ? undefined : theme.colors[colorMode].layer[3].hover,
      }}
      bg={isSelected ? `rgba(255, 233, 0, 0.06)` : 'transparent'}
      h={theme.sizes['8']}
      transitionProperty="colors"
      transitionDuration="normal"
      cursor="pointer"
      {...restProps}
    >
      <IconImage boxSize={theme.sizes['4']} src={data.icon} alt={data.name} />
      {data.name}
    </Flex>
  );
}
