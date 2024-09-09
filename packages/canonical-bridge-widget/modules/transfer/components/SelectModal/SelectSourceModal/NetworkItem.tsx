import { FlexProps, useColorMode, Flex, theme } from '@bnb-chain/space';

import { IconImage } from '@/core/components/IconImage';
import { BridgeChain } from '@/modules/bridges';

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
      px={'12px'}
      gap={'8px'}
      borderRadius={'8px'}
      border="1px solid"
      borderColor={
        isSelected ? theme.colors[colorMode].support.brand[3] : theme.colors[colorMode].border[3]
      }
      _hover={{
        bg: isSelected ? undefined : theme.colors[colorMode].layer[3].hover,
      }}
      bg={isSelected ? `rgba(255, 233, 0, 0.06)` : 'transparent'}
      h={'32px'}
      transitionProperty="colors"
      transitionDuration="normal"
      cursor="pointer"
      {...restProps}
    >
      <IconImage boxSize={'16px'} src={data.icon} alt={data.name} />
      {data.name}
    </Flex>
  );
}
