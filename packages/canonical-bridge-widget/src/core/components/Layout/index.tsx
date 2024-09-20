import { Flex } from '@bnb-chain/space';

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
        w={['100%', '100%', '100%', 'auto']}
        p={['32px 20px', '32px 20px', '36px 36px 40px']}
        alignItems="center"
      >
        {children}
      </Flex>
      <Footer />
    </Flex>
  );
}
