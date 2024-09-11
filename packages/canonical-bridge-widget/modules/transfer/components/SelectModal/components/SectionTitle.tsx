import { Flex, FlexProps, useColorMode } from '@bnb-chain/space';

import { useAppSelector } from '@/modules/store/StoreProvider';

interface SectionTitleProps extends FlexProps {}

export function SectionTitle(props: SectionTitleProps) {
  const { colorMode } = useColorMode();
  const theme = useAppSelector((state) => state.theme.themeConfig);
  return <Flex color={theme.colors[colorMode].modal.title} {...props} />;
}
