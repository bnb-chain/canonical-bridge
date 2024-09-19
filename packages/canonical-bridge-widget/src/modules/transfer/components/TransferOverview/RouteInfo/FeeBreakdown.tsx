import { Box, Flex, useTheme } from '@bnb-chain/space';

export const FeeBreakdown = ({ title, value }: { title: string; value: string }) => {
  const theme = useTheme();
  // TODO: Use colorMode
  return (
    <Flex flexDir={'row'} color={theme.colors.light.text.primary} gap={'4px'}>
      <Box fontSize={'12px'} fontWeight={400}>
        {title}
      </Box>
      <Box fontSize={'12px'} fontWeight={700}>
        {value}
      </Box>
    </Flex>
  );
};
