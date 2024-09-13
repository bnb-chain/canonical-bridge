import { Flex, FlexProps, useColorMode, useTheme } from '@bnb-chain/space';

interface SectionTitleProps extends FlexProps {}

export function SectionTitle(props: SectionTitleProps) {
  const { colorMode } = useColorMode();
  const theme = useTheme();
  return <Flex color={theme.colors[colorMode].modal.title} {...props} />;
}
