import { Flex, theme } from '@bnb-chain/space';

import { Footer } from '@/core/components/Layout/Footer';
import { Header } from '@/core/components/Layout/Header';

export function Layout({ children }: React.PropsWithChildren) {
  return (
    <Flex display="flex" flexDir="column" minH="100vh">
      <Header />
      <Flex
        as="main"
        flexDir="column"
        flex={1}
        p={theme.sizes['6']}
        pt={theme.sizes['10']}
        alignItems="center"
      >
        {children}
      </Flex>
      <Footer />
    </Flex>
  );
}
