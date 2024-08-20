import { TickIcon } from '@bnb-chain/icons';
import { Center, Flex, css, useColorMode } from '@chakra-ui/react';
import { useContext } from 'react';
import { GroupBase, OptionProps } from 'react-select';

import { theme } from '../../modules/theme';
import { Space } from '../Space';

import { Context } from './context';

export const SelectOption = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>({
  innerRef,
  innerProps,
  children,
  ...otherProps
}: OptionProps<Option, IsMulti, Group>) => {
  const { colorMode } = useColorMode();

  const { styles } = useContext(Context);

  return (
    <Flex
      ref={innerRef}
      alignItems="center"
      {...css(styles)(theme)}
      borderRadius={0}
      _hover={{ backgroundColor: theme.colors[colorMode].layer[4].hover }}
      _active={{ backgroundColor: theme.colors[colorMode].layer[4].hover }}
      {...(otherProps.isSelected
        ? {
            backgroundColor: theme.colors[colorMode].layer[4].hover,
          }
        : {
            backgroundColor: theme.colors[colorMode].layer[4].default,
          })}
      {...innerProps}
    >
      {children}
      {otherProps.isSelected && (
        <>
          <Space size="fill" />
          <Center p={theme.sizes['1']}>
            <TickIcon fontSize={theme.sizes['4']} />
          </Center>
        </>
      )}
    </Flex>
  );
};
