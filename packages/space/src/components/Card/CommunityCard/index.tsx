import { ComponentWithAs, Flex, FlexProps, forwardRef, useColorMode } from '@chakra-ui/react';

import { theme } from '../../../modules/theme';

export { CommunityCardTitle } from './CommunityCardTitle';

export const CommunityCard: ComponentWithAs<'div', FlexProps> = forwardRef<FlexProps, 'div'>(
  (props, ref) => {
    const { colorMode } = useColorMode();

    return (
      <Flex
        ref={ref}
        flexDirection="column"
        alignItems={{ base: 'center', md: 'center' }}
        justifyContent="start"
        bg={theme.colors[colorMode].layer[2].default}
        color={theme.colors[colorMode].text.primary}
        border={`1px solid ${theme.colors[colorMode].border[2]}`}
        borderRadius={theme.sizes['6']}
        boxShadow={theme.colors[colorMode].shadow[4]}
        px={{ base: theme.sizes['4'], md: theme.sizes['4'] }}
        py={{ base: theme.sizes['8'], md: theme.sizes['8'] }}
        transition="transform 0.2s ease-in-out"
        sx={{
          svg: {
            fontSize: theme.sizes['8'],
            mb: theme.sizes['4'],
          },
        }}
        _hover={{
          cursor: 'pointer',
          bg: theme.colors[colorMode].layer[2].hover,
          transform: `translate(0, -${theme.sizes['2']})`,
        }}
        {...props}
      />
    );
  },
);
