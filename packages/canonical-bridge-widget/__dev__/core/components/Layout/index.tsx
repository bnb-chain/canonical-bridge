import { Flex } from '@bnb-chain/space';

import { Header } from '@/dev/core/components/Layout/Header';
import { Footer } from '@/dev/core/components/Layout/Footer';

export function Layout({ children }: React.PropsWithChildren) {
  return (
    <Flex display="flex" flexDir="column" minH="100vh" position="relative">
      <Header zIndex={10} />
      <Flex
        as="main"
        flexDir="column"
        flex={1}
        w={['100%', '100%', '100%', 'auto']}
        p={['24px 20px', '24px 20px', '40px']}
        alignItems="center"
      >
        {children}
      </Flex>
      <Footer />
    </Flex>
  );
}
