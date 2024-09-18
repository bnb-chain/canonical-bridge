import { FlexProps, useColorMode, Flex, useTheme } from '@bnb-chain/space';

import { IconImage } from '@/core/components/IconImage';
import { IBridgeChain } from '@/modules/aggregator/types';

interface NetworkItemProps extends FlexProps {
  data: IBridgeChain;
  isSelected?: boolean;
}

export function NetworkItem(props: NetworkItemProps) {
  const { data, isSelected = false, ...restProps } = props;

  const { colorMode } = useColorMode();
  const theme = useTheme();

  return (
    <Flex
      alignItems="center"
      px={'12px'}
      gap={'8px'}
      borderRadius={'8px'}
      border="1px solid"
      borderColor={
        isSelected
          ? theme.colors[colorMode].background.brand
          : theme.colors[colorMode].button.select.border
      }
      color={theme.colors[colorMode].button.select.text}
      _hover={{
        bg: isSelected ? undefined : theme.colors[colorMode].button.select.background.hover,
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
