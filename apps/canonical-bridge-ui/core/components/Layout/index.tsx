import { Flex } from '@bnb-chain/space';

import { Footer } from '@/core/components/Layout/Footer';
import { Header } from '@/core/components/Layout/Header';

export function Layout({ children }: React.PropsWithChildren) {
  return (
    <Flex display="flex" flexDir="column" minH="100vh">
      <Header />
      <Flex
        as="main"
        flex={1}
        p={['24px 20px', '24px 20px', '40px']}
        w={['100%']}
        mb={['120px', '120px', '160px']}
        alignItems={'flex-start'}
        justifyContent={'center'}
      >
        {children}
      </Flex>
      <Footer />
    </Flex>
  );
}
