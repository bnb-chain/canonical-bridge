import { Flex, useColorMode, useTheme } from '@bnb-chain/space';

interface RouteWrapperProps {
  isError?: boolean;
  isSelected: boolean;
  onSelectBridge: () => void;
  children: React.ReactNode;
}

export const RouteWrapper = ({
  isError,
  onSelectBridge,
  isSelected,
  children,
}: RouteWrapperProps) => {
  const { colorMode } = useColorMode();
  const theme = useTheme();

  return (
    <Flex
      flex={1}
      flexDir={'column'}
      gap={'4px'}
      border={`1px solid`}
      height={'fit-content'}
      borderColor={
        isSelected
          ? theme.colors[colorMode].border.brand
          : theme.colors[colorMode].button.select.border
      }
      background={isSelected ? 'rgba(255, 233, 0, 0.06);' : 'none'}
      borderRadius={'8px'}
      padding={'16px'}
      position={'relative'}
      cursor={isError ? 'default' : 'pointer'}
      _hover={{
        borderColor: isError
          ? theme.colors[colorMode].button.select.border
          : theme.colors[colorMode].border.brand,
      }}
      onClick={onSelectBridge}
    >
      {children}
    </Flex>
  );
};
