import { Flex, theme, useColorMode } from '@bnb-chain/space';
import { ReactNode, useState } from 'react';

import { ExpandDetailsIcon } from '@/core/components/icons/ExpandDetails';
import { HideDetailsIcon } from '@/core/components/icons/HideDetails';

export const AdditionalDetails = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { colorMode } = useColorMode();
  return (
    <Flex flexDir={'column'} fontSize={'14px'}>
      <Flex flexDir={'column'} display={isOpen ? 'flex' : 'none'} gap={'4px'}>
        {children}
      </Flex>
      <Flex
        flexDir={'row'}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        cursor={'pointer'}
        alignItems={'center'}
        color={theme.colors[colorMode].text.tertiary}
      >
        {isOpen ? (
          <Flex
            justifyContent={'center'}
            alignItems={'center'}
            borderRadius={'50%'}
            w={'24px'}
            h={'24px'}
            background={theme.colors[colorMode].button.primary.subtle}
            color={theme.colors[colorMode].button.primary.default}
            position={'absolute'}
            bottom={0}
            left={'50%'}
            transform={'translateX(-50%) translateY(50%)'}
            _hover={{
              background: theme.colors[colorMode].button.primary.default,
              color: theme.colors[colorMode].text.inverse,
            }}
          >
            <HideDetailsIcon w={'16px'} h={'16px'} />
          </Flex>
        ) : (
          <Flex
            justifyContent={'center'}
            alignItems={'center'}
            borderRadius={'50%'}
            w={'24px'}
            h={'24px'}
            background={theme.colors[colorMode].button.primary.subtle}
            color={theme.colors[colorMode].button.primary.default}
            _hover={{
              background: theme.colors[colorMode].button.primary.default,
              color: theme.colors[colorMode].text.inverse,
            }}
            position={'absolute'}
            bottom={0}
            left={'50%'}
            transform={'translateX(-50%) translateY(50%)'}
          >
            <ExpandDetailsIcon w={'16px'} h={'16px'} />
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};
