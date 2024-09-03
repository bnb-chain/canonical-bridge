import { Flex, FlexProps, theme, useColorMode } from '@bnb-chain/space';

interface SectionTitleProps extends FlexProps {}

export function SectionTitle(props: SectionTitleProps) {
  const { colorMode } = useColorMode();
  return <Flex color={theme.colors[colorMode].text.secondary} {...props} />;
}
