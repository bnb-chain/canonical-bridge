import { Flex } from '@bnb-chain/space';

import { Footer } from '@/dev/components/Layout/Footer';
import { Header } from '@/dev/components/Layout/Header';

export function Layout({ children }: React.PropsWithChildren) {
  return (
    <Flex display="flex" flexDir="column" minH="100vh">
      <Header />
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
